import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Color, Group, Mesh, MathUtils, Object3D, InstancedMesh } from 'three';
import { GameStatus, PipeData, AppSettings, CoinData } from '../types';

// Constants
const GRAVITY = 25.0;
const JUMP_FORCE = 9.0;
const SPEED_BASE = 12.0;
const PIPE_SPACING = 20;
const PIPE_GAP_SIZE = 5.0;
const PIPE_WIDTH = 3.5;
const PIPE_HEIGHT = 20;
const MAX_Y = 15;
const MIN_Y = -8;

interface GameSceneProps {
  status: GameStatus;
  onCrash: () => void;
  onScore: () => void;
  onCoin: () => void;
  settings: AppSettings;
}

const PlayerCamera = ({ status, onCrash, onScore, onCoin, settings }: GameSceneProps) => {
  const { camera } = useThree();
  const velocityY = useRef(0);
  const positionY = useRef(0);
  const positionZ = useRef(0);
  const speed = useRef(SPEED_BASE);
  
  // Audio refs
  const flapSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3'));
  const crashSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/265/265-preview.mp3'));
  const coinSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'));
  
  // Instanced Mesh Refs
  const pipeBodyRef = useRef<InstancedMesh>(null);
  const pipeCapRef = useRef<InstancedMesh>(null);
  const coinRef = useRef<InstancedMesh>(null);
  
  // Temporary Object3D for matrix calculations (avoids GC)
  const tempObj = useMemo(() => new Object3D(), []);
  
  const pipesData = useRef<PipeData[]>([]);
  const coinsData = useRef<CoinData[]>([]);

  // Function to update mesh visuals based on current data
  // Extracted so we can call it on Init AND on Loop
  const updateMeshes = () => {
      if (!pipeBodyRef.current || !pipeCapRef.current || !coinRef.current) return;

      // PIPES
      pipesData.current.forEach((pipe, i) => {
          const idxTop = i * 2;
          const idxBottom = i * 2 + 1;

          // 1. Top Pipe Body
          tempObj.position.set(0, (pipe.yGapCenter + PIPE_GAP_SIZE/2) + (PIPE_HEIGHT/2), pipe.z);
          tempObj.rotation.set(0, 0, 0);
          tempObj.updateMatrix();
          pipeBodyRef.current!.setMatrixAt(idxTop, tempObj.matrix);

          // 2. Top Pipe Cap
          tempObj.position.set(0, (pipe.yGapCenter + PIPE_GAP_SIZE/2) + 0.5, pipe.z);
          tempObj.updateMatrix();
          pipeCapRef.current!.setMatrixAt(idxTop, tempObj.matrix);

          // 3. Bottom Pipe Body
          tempObj.position.set(0, (pipe.yGapCenter - PIPE_GAP_SIZE/2) - (PIPE_HEIGHT/2), pipe.z);
          tempObj.updateMatrix();
          pipeBodyRef.current!.setMatrixAt(idxBottom, tempObj.matrix);

          // 4. Bottom Pipe Cap
          tempObj.position.set(0, (pipe.yGapCenter - PIPE_GAP_SIZE/2) - 0.5, pipe.z);
          tempObj.updateMatrix();
          pipeCapRef.current!.setMatrixAt(idxBottom, tempObj.matrix);
      });
      pipeBodyRef.current.instanceMatrix.needsUpdate = true;
      pipeCapRef.current.instanceMatrix.needsUpdate = true;

      // COINS
      coinsData.current.forEach((coin, i) => {
          if (coin.collected) {
              tempObj.position.set(0, -1000, 0);
          } else {
              tempObj.position.set(coin.x, coin.y, coin.z);
              // Simple rotation for static update, Frame loop handles spin
              tempObj.rotation.set(Math.PI/2, 0, 0); 
          }
          tempObj.updateMatrix();
          coinRef.current!.setMatrixAt(i, tempObj.matrix);
      });
      coinRef.current.instanceMatrix.needsUpdate = true;
  };

  // Initialize Game
  useEffect(() => {
    if (status === GameStatus.IDLE) {
      positionY.current = 0;
      positionZ.current = 0;
      velocityY.current = 0;
      speed.current = SPEED_BASE;
      
      // Default Camera: Facing -Z (Standard WebGL)
      camera.position.set(0, 0, 0);
      camera.rotation.set(0, 0, 0); 
      
      // Initialize Pipes in -Z direction
      const initialPipes: PipeData[] = [];
      for (let i = 0; i < 8; i++) {
        initialPipes.push({
          id: i,
          z: -40 - (i * PIPE_SPACING), // Spawn ahead (in negative Z)
          yGapCenter: (Math.random() * 8) - 2,
          passed: false
        });
      }
      pipesData.current = initialPipes;
      
      // Initialize Coins
      const initialCoins: CoinData[] = [];
      for (let i = 0; i < 8; i++) {
          initialCoins.push({
              id: i,
              z: -40 - (i * PIPE_SPACING) + (PIPE_SPACING / 2),
              y: (Math.random() * 6) - 3,
              x: 0,
              collected: false
          });
      }
      coinsData.current = initialCoins;

      // FORCE UPDATE VISUALS NOW
      // This fixes the "invisible pipes after restart" bug
      // We need to verify refs exist first (might need a tick)
      requestAnimationFrame(() => updateMeshes());
    }
  }, [status, camera]);

  // Input Handling
  useEffect(() => {
    const handleInput = (e?: Event) => {
      if (status !== GameStatus.PLAYING) return;
      if (e && e.type !== 'keydown') e.preventDefault();
      
      velocityY.current = JUMP_FORCE;
      
      if (settings.sfxVolume) {
          const audio = flapSound.current.cloneNode() as HTMLAudioElement;
          audio.volume = 0.3;
          audio.play().catch(() => {});
      }
    };

    window.addEventListener('mousedown', handleInput);
    window.addEventListener('touchstart', handleInput, { passive: false });
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') handleInput(e);
    });

    return () => {
      window.removeEventListener('mousedown', handleInput);
      window.removeEventListener('touchstart', handleInput);
      window.removeEventListener('keydown', handleInput);
    };
  }, [status, settings.sfxVolume]);

  useFrame((state, delta) => {
    if (status !== GameStatus.PLAYING) {
        if (status === GameStatus.IDLE) {
             // Idle animation
             state.camera.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5;
             state.camera.position.z -= delta * 5; 
        }
        return;
    }

    // --- PHYSICS ---
    velocityY.current -= GRAVITY * delta;
    positionY.current += velocityY.current * delta;
    positionZ.current -= speed.current * delta;

    // Camera Update
    state.camera.position.z = positionZ.current;
    state.camera.position.y = positionY.current;
    state.camera.rotation.z = -velocityY.current * 0.01;

    // --- COLLISION: Floor/Ceiling ---
    if (positionY.current > MAX_Y || positionY.current < MIN_Y) {
      if (settings.sfxVolume) crashSound.current.play().catch(()=>{});
      onCrash();
      return;
    }

    // --- LOGIC ---
    const playerZ = positionZ.current;
    const playerY = positionY.current;
    const hitBoxRadius = 0.4; 

    // Recycle Pipes & Check Collision
    pipesData.current.forEach((pipe) => {
        // Recycle: If pipe is significantly behind player (playerZ is -100, pipeZ is -50, -50 > -80)
        // Wait until it's comfortably behind
        if (pipe.z > playerZ + 20) { 
                let minZ = playerZ;
                pipesData.current.forEach(p => minZ = Math.min(minZ, p.z));
                pipe.z = minZ - PIPE_SPACING;
                pipe.yGapCenter = (Math.random() * 8) - 2;
                pipe.passed = false;
        }

        // Score
        if (!pipe.passed && playerZ < pipe.z) {
            pipe.passed = true;
            onScore();
            if (speed.current < 25) speed.current += 0.2;
        }

        // Collision
        if (playerZ < pipe.z + (PIPE_WIDTH/2 + hitBoxRadius) && playerZ > pipe.z - (PIPE_WIDTH/2 + hitBoxRadius)) {
            const gapTop = pipe.yGapCenter + PIPE_GAP_SIZE / 2;
            const gapBottom = pipe.yGapCenter - PIPE_GAP_SIZE / 2;
            if (playerY + hitBoxRadius > gapTop || playerY - hitBoxRadius < gapBottom) {
                if (settings.sfxVolume) crashSound.current.play().catch(()=>{});
                onCrash();
            }
        }
    });

    // Recycle Coins & Check Collision
    coinsData.current.forEach((coin) => {
        if (coin.z > playerZ + 20) {
            let minZ = playerZ;
            coinsData.current.forEach(c => minZ = Math.min(minZ, c.z));
            coin.z = minZ - PIPE_SPACING;
            coin.y = (Math.random() * 6) - 3;
            coin.collected = false;
        }

        if (!coin.collected) {
            const distZ = Math.abs(playerZ - coin.z);
            const distY = Math.abs(playerY - coin.y);
            if (distZ < 1 && distY < 1) {
                coin.collected = true;
                onCoin();
                if (settings.sfxVolume) {
                    const audio = coinSound.current.cloneNode() as HTMLAudioElement;
                    audio.volume = 0.2;
                    audio.play().catch(()=>{});
                }
            }
        }
    });

    // --- RENDER UPDATES ---
    // We update the matrices every frame based on the data
    if (pipeBodyRef.current && pipeCapRef.current && coinRef.current) {
        
        // Pipes
        pipesData.current.forEach((pipe, i) => {
            const idxTop = i * 2;
            const idxBottom = i * 2 + 1;

            // 1. Top Body
            tempObj.position.set(0, (pipe.yGapCenter + PIPE_GAP_SIZE/2) + (PIPE_HEIGHT/2), pipe.z);
            tempObj.rotation.set(0, 0, 0);
            tempObj.updateMatrix();
            pipeBodyRef.current!.setMatrixAt(idxTop, tempObj.matrix);

            // 2. Top Cap
            tempObj.position.set(0, (pipe.yGapCenter + PIPE_GAP_SIZE/2) + 0.5, pipe.z);
            tempObj.updateMatrix();
            pipeCapRef.current!.setMatrixAt(idxTop, tempObj.matrix);

            // 3. Bottom Body
            tempObj.position.set(0, (pipe.yGapCenter - PIPE_GAP_SIZE/2) - (PIPE_HEIGHT/2), pipe.z);
            tempObj.updateMatrix();
            pipeBodyRef.current!.setMatrixAt(idxBottom, tempObj.matrix);

            // 4. Bottom Cap
            tempObj.position.set(0, (pipe.yGapCenter - PIPE_GAP_SIZE/2) - 0.5, pipe.z);
            tempObj.updateMatrix();
            pipeCapRef.current!.setMatrixAt(idxBottom, tempObj.matrix);
        });
        pipeBodyRef.current.instanceMatrix.needsUpdate = true;
        pipeCapRef.current.instanceMatrix.needsUpdate = true;

        // Coins
        coinsData.current.forEach((coin, i) => {
             if (coin.collected) {
                tempObj.position.set(0, -1000, 0);
            } else {
                tempObj.position.set(coin.x, coin.y, coin.z);
                tempObj.rotation.set(Math.PI/2, state.clock.elapsedTime * 3, 0);
            }
            tempObj.updateMatrix();
            coinRef.current!.setMatrixAt(i, tempObj.matrix);
        });
        coinRef.current.instanceMatrix.needsUpdate = true;
    }

  });

  return (
    <>
        {/* Pipe Bodies (16 instances) - frustumCulled={false} fixes vanishing pipes */}
        <instancedMesh ref={pipeBodyRef} args={[undefined, undefined, 16]} frustumCulled={false}>
            <cylinderGeometry args={[PIPE_WIDTH/2, PIPE_WIDTH/2, PIPE_HEIGHT, 12]} />
            <meshStandardMaterial color="#00aa00" roughness={0.3} />
        </instancedMesh>
        
        {/* Pipe Caps (16 instances) */}
        <instancedMesh ref={pipeCapRef} args={[undefined, undefined, 16]} frustumCulled={false}>
            <cylinderGeometry args={[PIPE_WIDTH/2 + 0.3, PIPE_WIDTH/2 + 0.3, 1, 12]} />
            <meshStandardMaterial color="#008800" roughness={0.3} />
        </instancedMesh>

        {/* Coins (8 instances) */}
        <instancedMesh ref={coinRef} args={[undefined, undefined, 8]} frustumCulled={false}>
            <cylinderGeometry args={[0.8, 0.8, 0.2, 12]} />
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </instancedMesh>
    </>
  );
};

// --- BIRDS ---
const Bird = ({ position, speed, offset }: { position: [number, number, number], speed: number, offset: number }) => {
    const groupRef = useRef<Group>(null);
    const leftWingRef = useRef<Mesh>(null);
    const rightWingRef = useRef<Mesh>(null);
    const initialPos = useRef(position);
  
    useFrame((state, delta) => {
      if (!groupRef.current) return;
      
      const cameraZ = state.camera.position.z;
      
      // Move slightly slower than player to appear "background" or pass by
      // We essentially just move them in Z
      // Actually let's make them move forward in -Z direction but slowly
      groupRef.current.position.z -= speed * delta;
  
      // Reset if too far behind player (player moves -Z, so if bird.z > camera.z + 50)
      if (groupRef.current.position.z > cameraZ + 50) {
          groupRef.current.position.z = cameraZ - 150 - Math.random() * 50;
          groupRef.current.position.x = (Math.random() - 0.5) * 60;
          groupRef.current.position.y = 5 + Math.random() * 10;
      }
      // Also reset if they get too far ahead (unlikely since they are slower, but just in case)
      if (groupRef.current.position.z < cameraZ - 200) {
          groupRef.current.position.z = cameraZ + 20;
      }
      
      // Flap wings
      const flapSpeed = 10;
      const flap = Math.sin(state.clock.elapsedTime * flapSpeed + offset);
      
      if (leftWingRef.current) leftWingRef.current.rotation.z = flap * 0.5;
      if (rightWingRef.current) rightWingRef.current.rotation.z = -flap * 0.5;
      
      // Bobbing
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + offset) * 0.01;
    });
  
    return (
      <group ref={groupRef} position={new Vector3(...position)} rotation={[0, Math.PI, 0]}> 
          {/* Body - pointing forward */}
          <mesh rotation={[Math.PI/2, 0, 0]}>
              <coneGeometry args={[0.3, 1, 8]} />
              <meshStandardMaterial color="#fcd34d" />
          </mesh>
          <mesh position={[0, 0.5, -0.3]}>
               <sphereGeometry args={[0.25, 8, 8]} />
               <meshStandardMaterial color="#fbbf24" />
          </mesh>
          {/* Wings */}
          <mesh ref={leftWingRef} position={[0.4, 0.1, 0]}>
              <boxGeometry args={[0.8, 0.05, 0.4]} />
              <meshStandardMaterial color="#fffbeb" />
          </mesh>
          <mesh ref={rightWingRef} position={[-0.4, 0.1, 0]}>
              <boxGeometry args={[0.8, 0.05, 0.4]} />
              <meshStandardMaterial color="#fffbeb" />
          </mesh>
      </group>
    )
  }
  
  const BackgroundBirds = () => {
      const birds = useMemo(() => {
          return new Array(20).fill(0).map((_, i) => ({
              id: i,
              position: [
                  (Math.random() - 0.5) * 80,
                  5 + Math.random() * 15, // High up
                  -Math.random() * 150
              ] as [number, number, number],
              speed: 5 + Math.random() * 5, 
              offset: Math.random() * 100
          }));
      }, []);
  
      return (
          <group>
              {birds.map(bird => (
                  <Bird key={bird.id} position={bird.position} speed={bird.speed} offset={bird.offset} />
              ))}
          </group>
      )
  }

// --- DECORATIONS ---

const DecorationItem = ({ type, x, z, scale }: { type: 'bush' | 'mushroom' | 'hill', x: number, z: number, scale: number }) => {
    if (type === 'bush') {
        return (
            <group position={[x, -9, z]} scale={[scale, scale, scale]}>
                <mesh position={[0, 0.5, 0]}>
                    <sphereGeometry args={[1, 6, 6]} /> 
                    <meshStandardMaterial color="#228b22" />
                </mesh>
                <mesh position={[-0.8, 0.3, 0.2]}>
                    <sphereGeometry args={[0.7, 5, 5]} />
                    <meshStandardMaterial color="#228b22" />
                </mesh>
                <mesh position={[0.8, 0.3, -0.2]}>
                    <sphereGeometry args={[0.7, 5, 5]} />
                    <meshStandardMaterial color="#228b22" />
                </mesh>
            </group>
        )
    }
    if (type === 'mushroom') {
        return (
            <group position={[x, -9.5, z]} scale={[scale, scale, scale]}>
                <mesh position={[0, 0.5, 0]}>
                    <cylinderGeometry args={[0.3, 0.4, 1, 6]} />
                    <meshStandardMaterial color="#ffeebb" />
                </mesh>
                <mesh position={[0, 1, 0]}>
                    <sphereGeometry args={[0.8, 8, 8, 0, Math.PI * 2, 0, Math.PI/2]} />
                    <meshStandardMaterial color="#ff0000" />
                </mesh>
            </group>
        )
    }
    return (
        <group position={[x, -10, z]} scale={[scale, scale * 1.5, scale]}>
             <mesh position={[0, 2, 0]}>
                <coneGeometry args={[4, 5, 4]} />
                <meshStandardMaterial color="#4caf50" flatShading />
            </mesh>
            <mesh position={[0, 4, 0]}>
                 <coneGeometry args={[1.5, 2, 4]} />
                 <meshStandardMaterial color="#81c784" flatShading />
            </mesh>
        </group>
    )
}

const Decorations = ({ status }: { status: GameStatus }) => {
    const { camera } = useThree();
    const groupRef = useRef<Group>(null);
    const itemsRef = useRef<any[]>([]);

    // Initialize random items
    useMemo(() => {
        const items = [];
        const types = ['bush', 'bush', 'bush', 'mushroom', 'hill'];
        for (let i = 0; i < 40; i++) {
            items.push({
                id: i,
                type: types[Math.floor(Math.random() * types.length)],
                x: (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 25),
                z: -i * 8, 
                scale: 0.8 + Math.random() * 1.2
            });
        }
        itemsRef.current = items;
    }, []);

    // Reset items when game restarts (IDLE status)
    useEffect(() => {
        if (status === GameStatus.IDLE) {
            if (groupRef.current) {
                const children = groupRef.current.children;
                itemsRef.current.forEach((item, i) => {
                    item.z = -i * 8; 
                    item.x = (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 25);
                    if (children[i]) {
                        children[i].position.set(item.x, 0, item.z);
                    }
                });
            }
        }
    }, [status]);

    useFrame(() => {
        if (!groupRef.current) return;
        
        const playerZ = camera.position.z;
        const children = groupRef.current.children;

        children.forEach((mesh, i) => {
            const item = itemsRef.current[i];
            
            // Recycle items check
            if (item.z > playerZ + 20) {
                 let minZ = playerZ;
                 itemsRef.current.forEach(it => minZ = Math.min(minZ, it.z));
                 item.z = minZ - (5 + Math.random() * 10);
                 item.x = (Math.random() > 0.5 ? 1 : -1) * (8 + Math.random() * 30);
            }
            mesh.position.set(item.x, 0, item.z); 
        });
    });

    return (
        <group ref={groupRef}>
            {itemsRef.current.map((item, i) => (
                <group key={i}>
                    <DecorationItem type={item.type as any} x={0} z={0} scale={item.scale} />
                </group>
            ))}
        </group>
    );
};

const Environment = ({ status }: { status: GameStatus }) => {
    const { camera } = useThree();
    const groundRef = useRef<any>(null);
    const cloudsRef = useRef<any>(null);

    useFrame((state) => {
        if(groundRef.current) {
            groundRef.current.position.z = camera.position.z;
        }
        if (cloudsRef.current) {
             cloudsRef.current.position.z = camera.position.z;
             cloudsRef.current.rotation.y += 0.0005;
        }
    });

    return (
        <>
            <fog attach="fog" args={['#5c94fc', 20, 90]} />
            <ambientLight intensity={0.7} />
            <directionalLight position={[20, 30, 10]} intensity={1.5} castShadow />

            <group ref={groundRef} position={[0, -10, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[200, 200, 20, 20]} />
                    <meshStandardMaterial color="#6dc066" />
                </mesh>
                <gridHelper args={[200, 40, 0x4caf50, 0x4caf50]} position={[0, 0.1, 0]} />
            </group>

            <Decorations status={status} />
            
            {/* Added Birds to Environment - ONLY IN IDLE (Start Screen/Menu) */}
            {status === GameStatus.IDLE && <BackgroundBirds />}

             <group ref={cloudsRef}>
                <mesh position={[-15, 15, -30]}>
                    <sphereGeometry args={[4, 16, 16]} />
                    <meshStandardMaterial color="white" transparent opacity={0.8} />
                </mesh>
                <mesh position={[18, 12, -50]}>
                    <sphereGeometry args={[3, 16, 16]} />
                    <meshStandardMaterial color="white" transparent opacity={0.8} />
                </mesh>
             </group>
        </>
    );
}

export const GameScene: React.FC<GameSceneProps> = (props) => {
  return (
    <>
      <PlayerCamera {...props} />
      <Environment status={props.status} />
    </>
  );
};