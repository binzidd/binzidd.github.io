'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Dune3DScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeSection, setActiveSection] = useState<'heros' | 'timeline' | 'projects' | 'skills' | 'contact'>('heros');
  const [spiceIntensity, setSpiceIntensity] = useState<number>(0.85);
  const [cameraDepth, setCameraDepth] = useState<number>(12);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const webgl = gl as WebGLRenderingContext;

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      webgl.viewport(0, 0, canvas.width, canvas.height);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Shaders for Apple-inspired Dune 3D Landscape & Spice Particles
    const vsSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute float aSpiceSize;

      uniform mat4 uProjection;
      uniform mat4 uView;
      uniform float uTime;
      uniform float uScrollProgress;

      varying vec3 vPosition;
      varying vec3 vNormal;
      varying float vDist;

      void main() {
        vec3 pos = aPosition;
        
        // Procedural dune ripples & camera interaction
        if (aSpiceSize > 0.0) {
          // Floating Spice Particles
          pos.y += sin(uTime * 1.5 + pos.x * 2.0) * 0.4;
          pos.x += cos(uTime * 1.2 + pos.z * 1.5) * 0.3;
          pos.z += sin(uTime * 0.8 + pos.y * 3.0) * 0.2;
        } else {
          // 3D Arrakis Desert Terrain Displacements
          float duneWave = sin(pos.x * 0.3 + uTime * 0.2) * cos(pos.z * 0.3) * 1.8;
          float secondaryRipple = sin(pos.x * 1.2 - pos.z * 0.8) * 0.35;
          pos.y += duneWave + secondaryRipple;
        }

        vec4 modelView = uView * vec4(pos, 1.0);
        vPosition = pos;
        vNormal = aNormal;
        vDist = -modelView.z;

        gl_Position = uProjection * modelView;
        gl_PointSize = (aSpiceSize > 0.0) ? (aSpiceSize * (15.0 / -modelView.z)) : 1.0;
      }
    `;

    const fsSource = `
      precision mediump float;

      uniform float uTime;
      uniform float uScrollProgress;
      uniform vec3 uSunColor;
      uniform vec3 uShadowColor;

      varying vec3 vPosition;
      varying vec3 vNormal;
      varying float vDist;

      void main() {
        // Dune Amber & Metallic Gold Gradients
        vec3 duneBase = mix(vec3(0.85, 0.48, 0.12), vec3(0.95, 0.68, 0.22), sin(vPosition.x * 0.2 + uTime * 0.1) * 0.5 + 0.5);
        vec3 shadow = vec3(0.12, 0.06, 0.02);
        
        float lightIntensity = clamp(dot(normalize(vec3(0.5, 0.8, 0.6)), normalize(vNormal)), 0.1, 1.0);
        vec3 color = mix(shadow, duneBase, lightIntensity);

        // Atmospheric Spice Dust Fog
        float fog = clamp((vDist - 5.0) / 35.0, 0.0, 0.85);
        vec3 fogColor = vec3(0.18, 0.09, 0.03);

        gl_FragColor = vec4(mix(color, fogColor, fog), 0.95);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(webgl, webgl.VERTEX_SHADER, vsSource);
    const fragShader = createShader(webgl, webgl.FRAGMENT_SHADER, fsSource);
    if (!vertShader || !fragShader) return;

    const program = webgl.createProgram();
    if (!program) return;
    webgl.attachShader(program, vertShader);
    webgl.attachShader(program, fragShader);
    webgl.linkProgram(program);
    webgl.useProgram(program);

    // Create 3D Dune Grid mesh & Spice particles
    const positions: number[] = [];
    const normals: number[] = [];
    const spiceSizes: number[] = [];

    const gridSize = 60;
    const spacing = 1.2;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = (i - gridSize / 2) * spacing;
        const z = (j - gridSize / 2) * spacing;
        const y = -2.5;

        positions.push(x, y, z);
        normals.push(0.0, 1.0, 0.2);
        spiceSizes.push(0.0);
      }
    }

    // Add 800 3D Spice particles
    for (let k = 0; k < 800; k++) {
      positions.push(
        (Math.random() - 0.5) * 50,
        Math.random() * 15 - 2,
        (Math.random() - 0.5) * 50
      );
      normals.push(0, 0, 1);
      spiceSizes.push(Math.random() * 4.0 + 1.5);
    }

    const posBuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, posBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(positions), webgl.STATIC_DRAW);

    const normBuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, normBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(normals), webgl.STATIC_DRAW);

    const spiceBuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, spiceBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(spiceSizes), webgl.STATIC_DRAW);

    const aPos = webgl.getAttribLocation(program, 'aPosition');
    const aNorm = webgl.getAttribLocation(program, 'aNormal');
    const aSpice = webgl.getAttribLocation(program, 'aSpiceSize');

    const uProj = webgl.getUniformLocation(program, 'uProjection');
    const uView = webgl.getUniformLocation(program, 'uView');
    const uTime = webgl.getUniformLocation(program, 'uTime');
    const uScrollProgress = webgl.getUniformLocation(program, 'uScrollProgress');

    let animationFrameId: number;
    let startTime = Date.now();

    // Scroll listener for smooth Apple camera movement
    let currentScrollY = window.scrollY;
    const handleScroll = () => {
      currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(currentScrollY / (maxScroll || 1), 0), 1);
      
      if (progress < 0.2) setActiveSection('heros');
      else if (progress < 0.45) setActiveSection('timeline');
      else if (progress < 0.7) setActiveSection('projects');
      else if (progress < 0.85) setActiveSection('skills');
      else setActiveSection('contact');

      setSpiceIntensity(0.7 + progress * 0.6);
      setCameraDepth(12 - progress * 4);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = () => {
      const elapsed = (Date.now() - startTime) * 0.001;
      webgl.clearColor(0.05, 0.02, 0.01, 1.0);
      webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
      webgl.enable(webgl.DEPTH_TEST);

      // Perspective projection matrix
      const fov = 60 * (Math.PI / 180);
      const aspect = canvas.width / canvas.height;
      const near = 0.1;
      const far = 100.0;
      const f = 1.0 / Math.tan(fov / 2);
      const projMat = new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) / (near - far), -1,
        0, 0, (2 * far * near) / (near - far), 0
      ]);

      // Apple-style camera lerp according to scroll
      const scrollRatio = currentScrollY / (document.documentElement.scrollHeight || 1);
      const camY = 3.0 + Math.sin(scrollRatio * Math.PI * 2) * 1.5;
      const camZ = 12.0 - scrollRatio * 6.0;
      const camX = Math.cos(elapsed * 0.15) * 1.5;

      const viewMat = new Float32Array([
        1, 0, 0, 0,
        0, 0.93, 0.36, 0,
        0, -0.36, 0.93, 0,
        -camX, -camY, -camZ, 1
      ]);

      webgl.uniformMatrix4fv(uProj, false, projMat);
      webgl.uniformMatrix4fv(uView, false, viewMat);
      webgl.uniform1f(uTime, elapsed);
      webgl.uniform1f(uScrollProgress, scrollRatio);

      // Bind positions
      webgl.enableVertexAttribArray(aPos);
      webgl.bindBuffer(webgl.ARRAY_BUFFER, posBuffer);
      webgl.vertexAttribPointer(aPos, 3, webgl.FLOAT, false, 0, 0);

      // Bind normals
      webgl.enableVertexAttribArray(aNorm);
      webgl.bindBuffer(webgl.ARRAY_BUFFER, normBuffer);
      webgl.vertexAttribPointer(aNorm, 3, webgl.FLOAT, false, 0, 0);

      // Bind spice sizes
      webgl.enableVertexAttribArray(aSpice);
      webgl.bindBuffer(webgl.ARRAY_BUFFER, spiceBuffer);
      webgl.vertexAttribPointer(aSpice, 1, webgl.FLOAT, false, 0, 0);

      webgl.drawArrays(webgl.POINTS, 0, positions.length / 3);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 3D WebGL Dune & Spice Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block opacity-85" />

      {/* Cinematic Dune Celestial Eclipse Overlay */}
      <div className="absolute top-12 right-12 w-48 h-48 rounded-full border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-600/5 to-transparent backdrop-blur-xl shadow-[0_0_80px_rgba(245,158,11,0.25)] flex items-center justify-center">
        <div className="w-36 h-36 rounded-full bg-stone-950/90 border border-amber-400/40 shadow-inner flex flex-col items-center justify-center text-center p-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-400 font-mono">ARRAKIS 3D</span>
          <span className="text-xs font-serif tracking-widest text-amber-200 mt-1 uppercase">{activeSection}</span>
          <div className="mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[9px] font-mono text-amber-300/80">SPICE: {(spiceIntensity * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Glassmorphic Apple-style Dune Camera Status HUD */}
      <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full border border-amber-500/20 bg-stone-950/60 backdrop-blur-md text-amber-300/90 text-xs font-mono tracking-widest flex items-center gap-3 shadow-lg">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
        <span>DUNE 3D ENGINE // CAM DEPTH: {cameraDepth.toFixed(1)}m</span>
        <span className="text-amber-500/40">|</span>
        <span className="text-amber-200 uppercase">{activeSection} ORBIT</span>
      </div>
    </div>
  );
}
