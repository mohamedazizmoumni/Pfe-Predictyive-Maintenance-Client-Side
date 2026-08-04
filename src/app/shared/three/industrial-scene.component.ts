import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  ViewChild,
  afterNextRender,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type * as THREE_NS from 'three';
import { prefersReducedMotion } from '../reduced-motion.util';

type Mode = 'hero' | 'twin';

// A single reusable WebGL viewport used by both the hero and the digital
// twin section. Renders a stylized wireframe industrial rig (AI core +
// gyroscope-style rotor rings) rather than an imported model file, so there
// are no binary 3D assets to source or ship.
//
// - `hero` mode: wide framing, autonomous camera drift + mouse parallax,
//   orbiting sensor nodes, ambient telemetry particle field.
// - `twin` mode: tight centered framing, drag-to-rotate + idle auto-rotate,
//   no sensors/particles (clean "product shot" read).
//
// Three.js is dynamically imported inside a browser-only `afterNextRender`
// hook so it never loads during SSR/prerender and never sits in the initial
// bundle — it's fetched only after the surrounding page content has already
// painted. If WebGL isn't available, the CSS/SVG poster stays put and the
// canvas is never created.
@Component({
  selector: 'app-industrial-scene',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './industrial-scene.component.html',
  styleUrl: './industrial-scene.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndustrialSceneComponent implements OnDestroy {
  @Input() mode: Mode = 'hero';

  @ViewChild('host', { static: true }) hostRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly ready = signal(false);

  private renderer?: THREE_NS.WebGLRenderer;
  private scene?: THREE_NS.Scene;
  private camera?: THREE_NS.PerspectiveCamera;
  private group?: THREE_NS.Group;
  private sensors: { mesh: THREE_NS.Object3D; radius: number; speed: number; phase: number; tilt: number }[] = [];
  private animatedParts: { core: THREE_NS.Mesh; ring1: THREE_NS.Mesh; ring2: THREE_NS.Mesh } | null = null;
  private particles: THREE_NS.Points | null = null;

  private frameId: number | null = null;
  private resizeObserver?: ResizeObserver;
  private visibilityObserver?: IntersectionObserver;
  private clock?: THREE_NS.Clock;
  private isVisible = true;
  private reduceMotion = false;

  private pointer = { x: 0, y: 0 };
  private drag = { active: false, lastX: 0, rotationY: 0 };

  private onPointerMove = (event: PointerEvent) => this.handlePointerMove(event);
  private onPointerDown = (event: PointerEvent) => this.handlePointerDown(event);
  private onPointerUp = () => this.handlePointerUp();
  private onVisibilityChange = () => this.handleDocVisibility();

  constructor(private zone: NgZone) {
    afterNextRender(() => this.init());
  }

  private async init(): Promise<void> {
    if (!this.supportsWebGL()) {
      return;
    }

    this.reduceMotion = prefersReducedMotion();

    const THREE = await import('three');
    if (!this.hostRef || !this.canvasRef) {
      return;
    }

    const host = this.hostRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    const { width, height } = host.getBoundingClientRect();

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width || 600, height || 600, false);
    this.renderer = renderer;

    const scene = new THREE.Scene();
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(42, (width || 600) / (height || 600), 0.1, 100);
    camera.position.set(0, 0, this.mode === 'hero' ? 6.4 : 4.4);
    this.camera = camera;

    const group = new THREE.Group();
    scene.add(group);
    this.group = group;
    this.buildRig(THREE, group);

    if (this.mode === 'hero') {
      this.buildSensors(THREE, group);
      this.buildParticles(THREE, scene);
    }

    this.clock = new THREE.Clock();

    this.setupResize(host);
    this.setupVisibility(host);
    this.setupPointer(canvas);

    this.zone.runOutsideAngular(() => this.renderFrame());
    this.ready.set(true);

    if (this.reduceMotion) {
      // Render exactly one settled frame, then stop — a still, well-composed
      // shot instead of a frozen mid-motion one.
      this.stopLoop();
      this.renderOnce();
    }
  }

  private buildRig(THREE: typeof THREE_NS, group: THREE_NS.Group): void {
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.85, 1),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.85 })
    );
    group.add(core);

    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.018, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.55 })
    );
    ring1.rotation.x = Math.PI / 2.4;
    group.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.98, 0.012, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0x7dc4fc, transparent: true, opacity: 0.35 })
    );
    ring2.rotation.x = Math.PI / 1.7;
    ring2.rotation.y = Math.PI / 5;
    group.add(ring2);

    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const strut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 2.3, 6),
        new THREE.MeshBasicMaterial({ color: 0x7dc4fc, transparent: true, opacity: 0.22 })
      );
      strut.position.set(Math.cos(angle) * 1.05, 0, Math.sin(angle) * 1.05);
      group.add(strut);
    }

    this.animatedParts = { core, ring1, ring2 };
  }

  private buildSensors(THREE: typeof THREE_NS, group: THREE_NS.Group): void {
    const glowTexture = this.makeGlowTexture(THREE);
    const count = 6;

    for (let i = 0; i < count; i++) {
      const radius = 2.5 + (i % 3) * 0.35;
      const speed = 0.12 + (i % 4) * 0.05;
      const phase = (i / count) * Math.PI * 2;
      const tilt = ((i % 2 === 0 ? 1 : -1) * Math.PI) / (4 + (i % 3));

      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 12, 12),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x22d3ee : 0x7dc4fc })
      );

      const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: glowTexture, color: 0x22d3ee, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      glow.scale.setScalar(0.6);
      node.add(glow);

      group.add(node);
      this.sensors.push({ mesh: node, radius, speed, phase, tilt });
    }
  }

  private buildParticles(THREE: typeof THREE_NS, scene: THREE_NS.Scene): void {
    const count = 260;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const blue = new THREE.Color(0x3b82f6);
    const cyan = new THREE.Color(0x22d3ee);

    for (let i = 0; i < count; i++) {
      const radius = 3.2 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = blue.clone().lerp(cyan, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    this.particles = points;
    scene.add(points);
  }

  private makeGlowTexture(THREE: typeof THREE_NS): THREE_NS.CanvasTexture {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
    gradient.addColorStop(0.4, 'rgba(125,196,252,0.45)');
    gradient.addColorStop(1, 'rgba(34,211,238,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }

  private renderFrame = (): void => {
    if (!this.renderer || !this.scene || !this.camera || !this.clock || !this.group) {
      return;
    }

    if (this.isVisible && !this.reduceMotion) {
      const dt = Math.min(this.clock.getDelta(), 0.1);
      const elapsed = this.clock.elapsedTime;

      if (this.animatedParts) {
        this.animatedParts.core.rotation.y += dt * 0.12;
        this.animatedParts.core.rotation.x += dt * 0.05;
        this.animatedParts.ring1.rotation.z += dt * 0.18;
        this.animatedParts.ring2.rotation.z -= dt * 0.13;
      }

      for (const sensor of this.sensors) {
        const angle = elapsed * sensor.speed + sensor.phase;
        const x = Math.cos(angle) * sensor.radius;
        const z = Math.sin(angle) * sensor.radius;
        const y = Math.sin(angle * 1.6 + sensor.tilt) * 0.5;
        sensor.mesh.position.set(x, y, z);
      }

      if (this.particles) {
        this.particles.rotation.y += dt * 0.02;
      }

      if (this.mode === 'hero') {
        this.group.rotation.y += dt * 0.06;
        const targetX = this.pointer.x * 0.35;
        const targetY = this.pointer.y * -0.2;
        this.camera.position.x += (targetX - this.camera.position.x) * 0.04;
        this.camera.position.y += (targetY - this.camera.position.y) * 0.04;
        this.camera.lookAt(0, 0, 0);
      } else {
        if (!this.drag.active) {
          this.drag.rotationY += dt * 0.15;
        }
        this.group.rotation.y += (this.drag.rotationY - this.group.rotation.y) * 0.08;
      }
    }

    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(this.renderFrame);
  };

  private renderOnce(): void {
    this.renderer?.render(this.scene!, this.camera!);
  }

  private setupResize(host: HTMLElement): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || !this.renderer || !this.camera) {
        return;
      }
      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) {
        return;
      }
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
    });
    this.resizeObserver.observe(host);
  }

  private setupVisibility(host: HTMLElement): void {
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    this.visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        this.isVisible = entry.isIntersecting && document.visibilityState === 'visible';
      },
      { threshold: 0.05 }
    );
    this.visibilityObserver.observe(host);
  }

  private handleDocVisibility(): void {
    if (document.visibilityState === 'hidden') {
      this.isVisible = false;
    }
  }

  private setupPointer(canvas: HTMLCanvasElement): void {
    if (this.mode === 'hero') {
      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    } else {
      canvas.addEventListener('pointerdown', this.onPointerDown);
      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
      window.addEventListener('pointerup', this.onPointerUp);
    }
  }

  private handlePointerMove(event: PointerEvent): void {
    if (this.mode === 'hero') {
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
      return;
    }

    if (this.drag.active) {
      const deltaX = event.clientX - this.drag.lastX;
      this.drag.lastX = event.clientX;
      this.drag.rotationY += deltaX * 0.008;
    }
  }

  private handlePointerDown(event: PointerEvent): void {
    this.drag.active = true;
    this.drag.lastX = event.clientX;
  }

  private handlePointerUp(): void {
    this.drag.active = false;
  }

  private stopLoop(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  private supportsWebGL(): boolean {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
      return false;
    }
  }

  ngOnDestroy(): void {
    // Runs on every platform, but `init()` — and therefore every browser API
    // it touches — only ever ran if we're actually in the browser.
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    this.stopLoop();
    this.resizeObserver?.disconnect();
    this.visibilityObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.canvasRef?.nativeElement.removeEventListener('pointerdown', this.onPointerDown);

    this.scene?.traverse((obj) => {
      const mesh = obj as THREE_NS.Mesh;
      mesh.geometry?.dispose?.();
      const material = mesh.material as THREE_NS.Material | THREE_NS.Material[] | undefined;
      if (Array.isArray(material)) {
        material.forEach((m) => m.dispose());
      } else {
        material?.dispose();
      }
    });
    this.particles?.geometry?.dispose();
    this.renderer?.dispose();
  }
}
