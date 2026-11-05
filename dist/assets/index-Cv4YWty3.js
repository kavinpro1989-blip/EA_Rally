(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=new class{constructor(){this.listeners=new Map}on(e,t){return this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t),()=>this.off(e,t)}once(e,t){let n=(...r)=>{this.off(e,n),t(...r)};return this.on(e,n)}off(e,t){this.listeners.has(e)&&(this.listeners.get(e).delete(t),this.listeners.get(e).size===0&&this.listeners.delete(e))}emit(e,t){if(this.listeners.has(e)){let n=this.listeners.get(e);for(let r of n)try{r(t)}catch(t){console.error(`[EventBus] Error in listener for event "${e}":`,t)}}}clear(e){e?this.listeners.delete(e):this.listeners.clear()}},t={PHYSICS_TICK:`physics:tick`,TELEMETRY_UPDATE:`telemetry:update`,VEHICLE_COLLISION:`vehicle:collision`,WHEEL_SLIP:`vehicle:wheel_slip`,BOTTOM_OUT:`vehicle:bottom_out`,GEAR_SHIFT:`vehicle:gear_shift`,TURBO_BLOWOFF:`vehicle:turbo_blowoff`,BACKFIRE_POP:`vehicle:backfire_pop`,TUNING_UPDATED:`tuning:updated`,TUNING_PRESET_LOADED:`tuning:preset_loaded`,VISUAL_PART_CHANGED:`garage:visual_part_changed`,LIVERY_CHANGED:`garage:livery_changed`,STAGE_SELECTED:`stage:selected`,STAGE_COMPILED:`stage:compiled`,SURFACE_CHANGED:`stage:surface_changed`,PACENOTE_TRIGGER:`stage:pacenote_trigger`,STAGE_RESTART:`stage:restart`,CAMERA_VIEW_CHANGED:`camera:view_changed`,VIEWPORT_RESIZED:`viewport:resized`,GRAPHICS_SETTING_CHANGED:`viewport:graphics_changed`,HUD_VISIBILITY_TOGGLED:`hud:visibility_toggled`,ACTIVE_TAB_CHANGED:`ui:tab_changed`,NOTIFICATION:`ui:notification`},n={$schema:`http://json-schema.org/draft-07/schema#`,title:`EA Rally Vehicle Tuning & Mechanical Specification`,description:`Defines vehicle physics tuning, drivetrain differential locks, suspension kinematics, and visual aero specs for the EA Rally engine.`,version:`2.4.0`,activeProfile:`asphalt_monte_carlo`,currentTuning:{suspension:{frontSpringRate:95,rearSpringRate:85,frontRideHeight:140,rearRideHeight:150,frontBumpDamping:4200,rearBumpDamping:3800,frontReboundDamping:5800,rearReboundDamping:5200,frontFastBumpDamping:2100,rearFastBumpDamping:1900,frontAntiRollBar:48,rearAntiRollBar:38,frontCamberDeg:-2.8,rearCamberDeg:-1.8,frontToeDeg:-.15,rearToeDeg:.1},differential:{type:`mechanical_plate_limited_slip`,frontAccelLock:55,frontDecelLock:25,frontPreloadNm:65,centerTorqueSplitFront:42,centerTorqueSplitRear:58,centerLockRatio:45,rearAccelLock:75,rearDecelLock:40,rearPreloadNm:90},transmission:{type:`sequential_6_speed`,gearRatios:[3.45,2.38,1.76,1.35,1.08,.89],reverseRatio:3.65,finalDriveRatio:4.18,shiftTimeMs:42,clutchFrictionTorque:880},engine:{displacementLiters:1.6,cylinders:4,aspiration:`turbocharged_intercooled`,peakPowerBhp:385,peakTorqueNm:520,maxRpm:8400,idleRpm:1250,redlineRpm:7800,peakBoostBar:2.45,antiLagSystem:`aggressive`,revLimiter:`ign_cut_spark`},tires_and_brakes:{tireCompound:`soft_tarmac`,frontTirePressurePsi:27.5,rearTirePressurePsi:26,brakeBiasFrontPercent:63.5,maxBrakeTorqueNm:3800,handbrakeTorqueNm:4600},visual_parts:{aeroKit:`wrc_spec_high_downforce`,lightPods:`quad_hella_hood`,mudflaps:`rally_red`,liveryPreset:`wrc_red`,bodyColor:`#e10600`,secondaryColor:`#141414`,accentColor:`#ffffff`,rimColor:`#f0f0f0`,brakeCaliperColor:`#ff1a1a`,paintFinish:`gloss_racing`}},presets:{asphalt_monte_carlo:{name:`Monte Carlo Asphalt High-Grip`,description:`Stiff anti-roll bars, low ride height, high negative camber and aggressive front brake bias for tarmac hairpin stages.`,suspension:{frontSpringRate:110,rearSpringRate:98,frontRideHeight:115,rearRideHeight:125,frontBumpDamping:4800,rearBumpDamping:4400,frontReboundDamping:6400,rearReboundDamping:5900,frontFastBumpDamping:2400,rearFastBumpDamping:2200,frontAntiRollBar:56,rearAntiRollBar:46,frontCamberDeg:-3.2,rearCamberDeg:-2.2,frontToeDeg:-.2,rearToeDeg:.12},differential:{frontAccelLock:50,frontDecelLock:20,frontPreloadNm:50,centerTorqueSplitFront:45,centerTorqueSplitRear:55,centerLockRatio:40,rearAccelLock:70,rearDecelLock:35,rearPreloadNm:80},tires_and_brakes:{tireCompound:`soft_tarmac`,frontTirePressurePsi:28.5,rearTirePressurePsi:27,brakeBiasFrontPercent:64,maxBrakeTorqueNm:4100,handbrakeTorqueNm:4800},visual_parts:{aeroKit:`wrc_spec_high_downforce`,lightPods:`clean_stock`,mudflaps:`none`,liveryPreset:`wrc_red`}},gravel_finland_jumps:{name:`Finland High-Speed Rollercoaster`,description:`High ride height, long travel, progressive rebound damping to soak up mega crest landings and yumps at 190 km/h.`,suspension:{frontSpringRate:72,rearSpringRate:64,frontRideHeight:175,rearRideHeight:185,frontBumpDamping:3600,rearBumpDamping:3300,frontReboundDamping:6800,rearReboundDamping:6300,frontFastBumpDamping:1700,rearFastBumpDamping:1550,frontAntiRollBar:34,rearAntiRollBar:26,frontCamberDeg:-1.8,rearCamberDeg:-1.2,frontToeDeg:-.08,rearToeDeg:.05},differential:{frontAccelLock:65,frontDecelLock:35,frontPreloadNm:80,centerTorqueSplitFront:40,centerTorqueSplitRear:60,centerLockRatio:60,rearAccelLock:85,rearDecelLock:50,rearPreloadNm:110},tires_and_brakes:{tireCompound:`gravel_rough`,frontTirePressurePsi:24.5,rearTirePressurePsi:23.5,brakeBiasFrontPercent:59,maxBrakeTorqueNm:3600,handbrakeTorqueNm:4700},visual_parts:{aeroKit:`group_b_big_wing`,lightPods:`clean_stock`,mudflaps:`rally_red`,liveryPreset:`mud_camo`}},acropolis_rocky_gravel:{name:`Acropolis Rough Boulder Endurance`,description:`Reinforced spring rates, high fast-bump damping, thick mudflaps, and heavy locking diffs to withstand jagged rock tracks.`,suspension:{frontSpringRate:85,rearSpringRate:78,frontRideHeight:190,rearRideHeight:200,frontBumpDamping:4100,rearBumpDamping:3900,frontReboundDamping:5900,rearReboundDamping:5500,frontFastBumpDamping:2600,rearFastBumpDamping:2400,frontAntiRollBar:38,rearAntiRollBar:30,frontCamberDeg:-2,rearCamberDeg:-1.4,frontToeDeg:-.1,rearToeDeg:.08},differential:{frontAccelLock:70,frontDecelLock:40,frontPreloadNm:95,centerTorqueSplitFront:38,centerTorqueSplitRear:62,centerLockRatio:65,rearAccelLock:88,rearDecelLock:55,rearPreloadNm:120},tires_and_brakes:{tireCompound:`gravel_rough`,frontTirePressurePsi:25,rearTirePressurePsi:24,brakeBiasFrontPercent:60.5,maxBrakeTorqueNm:3700,handbrakeTorqueNm:4900},visual_parts:{aeroKit:`gravel_clubman`,lightPods:`quad_hella_hood`,mudflaps:`neon_yellow`,liveryPreset:`retro_apex`}},monte_carlo_night_ice:{name:`Col de Turini Night & Black Ice`,description:`Quad high-beam roof & hood light pods, softened anti-roll bars, studded winter compounds, and balanced center differential.`,suspension:{frontSpringRate:80,rearSpringRate:72,frontRideHeight:135,rearRideHeight:145,frontBumpDamping:3800,rearBumpDamping:3500,frontReboundDamping:5200,rearReboundDamping:4800,frontFastBumpDamping:2e3,rearFastBumpDamping:1800,frontAntiRollBar:36,rearAntiRollBar:28,frontCamberDeg:-2.2,rearCamberDeg:-1.5,frontToeDeg:-.05,rearToeDeg:.05},differential:{frontAccelLock:45,frontDecelLock:25,frontPreloadNm:60,centerTorqueSplitFront:50,centerTorqueSplitRear:50,centerLockRatio:50,rearAccelLock:60,rearDecelLock:35,rearPreloadNm:75},tires_and_brakes:{tireCompound:`snow_studded`,frontTirePressurePsi:26,rearTirePressurePsi:25,brakeBiasFrontPercent:57,maxBrakeTorqueNm:3200,handbrakeTorqueNm:4400},visual_parts:{aeroKit:`wrc_spec_high_downforce`,lightPods:`quad_hella_hood`,mudflaps:`stealth_black`,liveryPreset:`stealth_carbon`}}}},r={$schema:`http://json-schema.org/draft-07/schema#`,title:`EA Rally Stage Definition & GPS Spline Specification`,description:`Defines rally stage geometric road splines, GPS waypoints, elevation profile, terrain surface parameters, and AI co-driver pacenotes.`,version:`1.8.0`,activeStageId:`stage_monte_carlo_turini`,stages:{stage_monte_carlo_turini:{id:`stage_monte_carlo_turini`,name:`Col de Turini - Alpine Switchbacks`,region:`Maritime Alps, Monaco / France`,surface:`tarmac`,surfaceGripCoefficient:.98,weather:`sunset`,totalLengthMeters:4200,elevationGainMeters:380,baseRoadWidthMeters:5.8,shoulderWidthMeters:1.2,ambientLighting:{skyColor:`#ff7043`,groundColor:`#3e2723`,sunColor:`#ffab91`,sunPosition:[300,200,-400],fogDensity:7e-4,fogColor:`#d38067`},startPoint:{lat:43.9782,lon:7.3912,alt:1220},endPoint:{lat:43.9985,lon:7.3995,alt:1600},waypoints:[{distance:0,x:0,y:0,z:0,lat:43.9782,lon:7.3912,elevation:1220,camber:0,width:6.2},{distance:220,x:45,y:8,z:210,lat:43.9791,lon:7.3916,elevation:1228,camber:.02,width:6},{distance:450,x:160,y:22,z:410,lat:43.9805,lon:7.3925,elevation:1242,camber:-.05,width:5.8},{distance:700,x:240,y:48,z:620,lat:43.9818,lon:7.3932,elevation:1268,camber:.08,width:5.6},{distance:980,x:180,y:82,z:870,lat:43.9829,lon:7.3928,elevation:1302,camber:-.06,width:5.8},{distance:1250,x:90,y:118,z:1100,lat:43.984,lon:7.3921,elevation:1338,camber:.04,width:6},{distance:1580,x:230,y:158,z:1350,lat:43.9855,lon:7.3934,elevation:1378,camber:-.07,width:5.6},{distance:1920,x:380,y:195,z:1600,lat:43.9872,lon:7.3948,elevation:1415,camber:.05,width:5.8},{distance:2300,x:420,y:238,z:1940,lat:43.9891,lon:7.3952,elevation:1458,camber:-.04,width:6},{distance:2720,x:290,y:280,z:2280,lat:43.9912,lon:7.3941,elevation:1500,camber:.08,width:5.6},{distance:3150,x:180,y:315,z:2650,lat:43.9935,lon:7.393,elevation:1535,camber:-.06,width:5.8},{distance:3600,x:260,y:348,z:3050,lat:43.9961,lon:7.394,elevation:1568,camber:.03,width:6.2},{distance:4200,x:310,y:380,z:3580,lat:43.9985,lon:7.3995,elevation:1600,camber:0,width:6.5}],pacenotes:[{distance:80,call:`Flat Right 150`,type:`turn`,severity:6,direction:`right`,modifier:`flat`,detail:`Stay middle`},{distance:260,call:`Right 4 into Left 3`,type:`turn`,severity:4,direction:`right`,modifier:`into`,detail:`Don't cut`},{distance:510,call:`Caution Hairpin Left`,type:`hairpin`,severity:1,direction:`left`,modifier:`caution`,detail:`Handbrake turn`},{distance:820,call:`Left 5 over Crest 80`,type:`turn`,severity:5,direction:`left`,modifier:`crest`,detail:`Keep in`},{distance:1100,call:`Right 3 Tightens into Hairpin Right`,type:`hairpin`,severity:1,direction:`right`,modifier:`tightens`,detail:`Cliff on outside`},{distance:1420,call:`Flat Out 200`,type:`straight`,severity:6,direction:`straight`,modifier:`flat`,detail:`Max speed`},{distance:1750,call:`Left 2 Sharp Rock Inside`,type:`turn`,severity:2,direction:`left`,modifier:`caution`,detail:`Watch rock face`},{distance:2100,call:`Right 4 over Bridge 60`,type:`hazard`,severity:4,direction:`right`,modifier:`narrow`,detail:`Narrow bridge`},{distance:2550,call:`Left 3 into Right 2`,type:`chicane`,severity:2,direction:`right`,modifier:`into`,detail:`Technical chicane`},{distance:2980,call:`Hairpin Left Tightens uphill`,type:`hairpin`,severity:1,direction:`left`,modifier:`tightens`,detail:`First gear pull`},{distance:3450,call:`Right 5 long 120`,type:`turn`,severity:5,direction:`right`,modifier:`long`,detail:`Full throttle exit`},{distance:4050,call:`Finish Flying into Stop Control`,type:`finish`,severity:6,direction:`straight`,modifier:`finish`,detail:`Cross flying finish`}]},stage_finland_ouninpohja:{id:`stage_finland_ouninpohja`,name:`Ouninpohja - High-Speed Jumps`,region:`Central Finland`,surface:`gravel`,surfaceGripCoefficient:.82,weather:`sunny`,totalLengthMeters:5800,elevationGainMeters:160,baseRoadWidthMeters:6.8,shoulderWidthMeters:2,ambientLighting:{skyColor:`#90caf9`,groundColor:`#2e7d32`,sunColor:`#fff9c4`,sunPosition:[500,450,-200],fogDensity:4e-4,fogColor:`#cce5ff`},startPoint:{lat:61.834,lon:25.1205,alt:110},endPoint:{lat:61.872,lon:25.168,alt:145},waypoints:[{distance:0,x:0,y:0,z:0,lat:61.834,lon:25.1205,elevation:110,camber:0,width:7},{distance:450,x:60,y:15,z:440,lat:61.8375,lon:25.1235,elevation:125,camber:.02,width:6.8},{distance:950,x:140,y:-5,z:930,lat:61.8415,lon:25.128,elevation:105,camber:.04,width:6.8},{distance:1500,x:280,y:30,z:1450,lat:61.846,lon:25.1345,elevation:140,camber:-.03,width:7},{distance:2200,x:390,y:55,z:2100,lat:61.8515,lon:25.141,elevation:165,camber:.05,width:6.6},{distance:3100,x:510,y:10,z:2950,lat:61.8585,lon:25.148,elevation:120,camber:-.04,width:6.8},{distance:4100,x:660,y:45,z:3900,lat:61.8655,lon:25.1565,elevation:155,camber:.03,width:7},{distance:5e3,x:780,y:20,z:4750,lat:61.87,lon:25.162,elevation:130,camber:.02,width:7.2},{distance:5800,x:920,y:35,z:5500,lat:61.872,lon:25.168,elevation:145,camber:0,width:7.5}],pacenotes:[{distance:100,call:`Flat Out 200 into Big Jump`,type:`jump`,severity:6,direction:`straight`,modifier:`jump`,detail:`Stay center 50m airtime`},{distance:380,call:`Right 5 over Crest keep right`,type:`turn`,severity:5,direction:`right`,modifier:`crest`,detail:`Blind landing`},{distance:850,call:`Left 6 very long into Dip`,type:`turn`,severity:6,direction:`left`,modifier:`long`,detail:`Flat 180 km/h`},{distance:1350,call:`Caution Double Jump into Right 4`,type:`jump`,severity:4,direction:`right`,modifier:`caution`,detail:`Heavy compression`},{distance:1950,call:`Crest into Left 5 tightens 4`,type:`turn`,severity:4,direction:`left`,modifier:`tightens`,detail:`Ditch inside`},{distance:2750,call:`Flat Right over Crest 250`,type:`straight`,severity:6,direction:`right`,modifier:`flat`,detail:`Sixth gear`},{distance:3600,call:`Monster Jump 60m!`,type:`jump`,severity:6,direction:`straight`,modifier:`jump`,detail:`Full commit`},{distance:4450,call:`Right 4 minus over Crest into Left 3`,type:`turn`,severity:3,direction:`left`,modifier:`into`,detail:`Pine trees close`},{distance:5600,call:`Flying Finish 100`,type:`finish`,severity:6,direction:`straight`,modifier:`finish`,detail:`Brake hard after line`}]},stage_greece_acropolis:{id:`stage_greece_acropolis`,name:`Acropolis - Rough Rock Mountain Pass`,region:`Mount Parnassus, Central Greece`,surface:`rocky`,surfaceGripCoefficient:.74,weather:`sunny`,totalLengthMeters:4800,elevationGainMeters:410,baseRoadWidthMeters:5.2,shoulderWidthMeters:.8,ambientLighting:{skyColor:`#81d4fa`,groundColor:`#bcaaa4`,sunColor:`#fff59d`,sunPosition:[200,600,-300],fogDensity:6e-4,fogColor:`#e8eaf6`},startPoint:{lat:38.52,lon:22.56,alt:850},endPoint:{lat:38.552,lon:22.585,alt:1260},waypoints:[{distance:0,x:0,y:0,z:0,lat:38.52,lon:22.56,elevation:850,camber:0,width:5.4},{distance:600,x:80,y:50,z:580,lat:38.524,lon:22.563,elevation:900,camber:-.04,width:5.2},{distance:1300,x:220,y:120,z:1220,lat:38.529,lon:22.568,elevation:970,camber:.06,width:5},{distance:2100,x:350,y:195,z:1950,lat:38.535,lon:22.573,elevation:1045,camber:-.05,width:5.2},{distance:3e3,x:280,y:270,z:2750,lat:38.541,lon:22.577,elevation:1120,camber:.07,width:5},{distance:3900,x:390,y:345,z:3550,lat:38.547,lon:22.581,elevation:1195,camber:-.04,width:5.3},{distance:4800,x:480,y:410,z:4350,lat:38.552,lon:22.585,elevation:1260,camber:0,width:5.8}],pacenotes:[{distance:120,call:`Caution Rough Surface into Right 3`,type:`hazard`,severity:3,direction:`right`,modifier:`rough`,detail:`Loose bedrock`},{distance:520,call:`Left 2 over Rocks don't cut`,type:`turn`,severity:2,direction:`left`,modifier:`caution`,detail:`Puncture risk`},{distance:1150,call:`Hairpin Right narrow cliff`,type:`hairpin`,severity:1,direction:`right`,modifier:`narrow`,detail:`Steep drop on left`},{distance:1850,call:`Left 4 plus 100 over Crest`,type:`turn`,severity:4,direction:`left`,modifier:`crest`,detail:`Heavy dust trail`},{distance:2600,call:`Right 2 Sharp Rock Face`,type:`turn`,severity:2,direction:`right`,modifier:`sharp`,detail:`Tight rocky corridor`},{distance:3500,call:`Hairpin Left open into Flat Right`,type:`hairpin`,severity:1,direction:`left`,modifier:`into`,detail:`Power slide exit`},{distance:4600,call:`Flying Finish through Quarry`,type:`finish`,severity:6,direction:`straight`,modifier:`finish`,detail:`Full power across line`}]}}},i=new class{constructor(){this.tuningConfig=JSON.parse(JSON.stringify(n)),this.stageConfig=JSON.parse(JSON.stringify(r)),this.activeStageId=this.stageConfig.activeStageId||`stage_monte_carlo_turini`,this.activeStage=this.stageConfig.stages[this.activeStageId],this.currentTuning=JSON.parse(JSON.stringify(this.tuningConfig.currentTuning)),this.activeProfile=this.tuningConfig.activeProfile||`asphalt_monte_carlo`,this.cameraMode=`chase`,this.fieldOfView=65,this.hudSettings={showTelemetry:!0,showCoDriver:!0,showSuspensionTravel:!0,showTireTemps:!0,showGForceCircle:!0,showBoostGauge:!0,showMiniMap:!0,audioCoDriverEnabled:!0,coDriverVolume:.85},this.activeTab=`stage_drive`,this._loadSavedState()}_loadSavedState(){try{let e=localStorage.getItem(`ea_rally_tuning_state`);if(e){let t=JSON.parse(e);t.currentTuning&&(this.currentTuning={...this.currentTuning,...t.currentTuning}),t.activeProfile&&(this.activeProfile=t.activeProfile)}}catch{}}_persistState(){try{localStorage.setItem(`ea_rally_tuning_state`,JSON.stringify({currentTuning:this.currentTuning,activeProfile:this.activeProfile}))}catch{}}updateTuningParameter(n,r,i){this.currentTuning[n]||(this.currentTuning[n]={}),this.currentTuning[n][r]=i,this._persistState(),e.emit(t.TUNING_UPDATED,{section:n,key:r,value:i,fullTuning:this.currentTuning})}loadTuningPreset(n){let r=this.tuningConfig.presets[n];if(!r)console.warn(`[StateStore] Preset ${n} not found.`);else{this.activeProfile=n;for(let e of[`suspension`,`differential`,`transmission`,`tires_and_brakes`,`visual_parts`])r[e]&&(this.currentTuning[e]={...this.currentTuning[e],...r[e]});this._persistState(),e.emit(t.TUNING_PRESET_LOADED,{presetId:n,preset:r,fullTuning:this.currentTuning}),e.emit(t.TUNING_UPDATED,{section:`all`,fullTuning:this.currentTuning})}}setActiveStage(n){let r=this.stageConfig.stages[n];r?(this.activeStageId=n,this.activeStage=r,e.emit(t.STAGE_SELECTED,{stageId:n,stage:r})):console.warn(`[StateStore] Stage ${n} not found.`)}setCompiledStage(n){this.stageConfig.stages[n.id]=n,this.activeStageId=n.id,this.activeStage=n,e.emit(t.STAGE_COMPILED,{stageId:n.id,stage:n})}setCameraMode(n){this.cameraMode=n,e.emit(t.CAMERA_VIEW_CHANGED,{mode:n})}setActiveTab(n){this.activeTab=n,e.emit(t.ACTIVE_TAB_CHANGED,{tabId:n})}exportTuningSchemaJson(){let e={...this.tuningConfig,activeProfile:this.activeProfile,currentTuning:this.currentTuning,exportedAt:new Date().toISOString()};return JSON.stringify(e,null,2)}},a=new class{constructor(){this.isRunning=!1,this.lastTime=performance.now(),this.tickCount=0,this.position={x:0,y:.5,z:0},this.velocity={x:0,y:0,z:0},this.rotation={yaw:0,pitch:0,roll:0},this.angularVelocity={yaw:0,pitch:0,roll:0},this.speedKph=0,this.speedMs=0,this.engineRpm=1200,this.gear=1,this.turboBoostBar=0,this.peakBoostBar=0,this.steeringAngleDeg=0,this.driftAngleDeg=0,this.isAirborne=!1,this.airTimeSec=0,this.inputs={throttle:0,brake:0,clutch:0,handbrake:0,steer:0,isAutomatic:!0},this.wheels={fl:this._createWheelState(`fl`,-.85,1.25),fr:this._createWheelState(`fr`,.85,1.25),rl:this._createWheelState(`rl`,-.85,-1.25),rr:this._createWheelState(`rr`,.85,-1.25)},this.gForces={lateralG:0,longitudinalG:0,verticalG:1,yawRateDegS:0},this.stageDistanceM=0,this.stageTimeSec=0,this.lastPacenoteIndex=-1,this.stageSpline=null,this._bindKeyboardEvents(),this._setupTuningListeners()}_createWheelState(e,t,n){return{id:e,relX:t,relZ:n,suspensionTravelMm:140,maxTravelMm:280,compressionPct:50,damperVelocityMs:0,bottomedOut:!1,coreTempC:82,surfaceTempC:84.5,pressurePsi:27.5,slipAngleDeg:0,slipRatio:0,gripUtilPct:15,rotationRad:0,steerAngleDeg:0,angularVelocityRps:0,onGround:!0}}_bindKeyboardEvents(){this.keysDown=new Set,window.addEventListener(`keydown`,n=>{if(![`INPUT`,`TEXTAREA`,`SELECT`].includes(n.target?.tagName)){if(this.keysDown.add(n.code),n.code===`KeyC`){let e=[`chase`,`onboard`,`helicopter`],t=e[(e.indexOf(i.cameraMode)+1)%e.length];i.setCameraMode(t)}n.code===`KeyT`&&(i.hudSettings.showTelemetry=!i.hudSettings.showTelemetry,e.emit(t.HUD_VISIBILITY_TOGGLED,i.hudSettings)),n.code===`KeyE`?this.shiftGear(1):n.code===`KeyQ`&&this.shiftGear(-1),n.code===`KeyR`&&this.resetVehicle(),n.code===`KeyM`&&(this.inputs.isAutomatic=!this.inputs.isAutomatic,e.emit(t.NOTIFICATION,{title:`Transmission Mode`,message:this.inputs.isAutomatic?`Sequential Automatic`:`Manual Sequential (Q/E to shift)`}))}}),window.addEventListener(`keyup`,e=>{this.keysDown.delete(e.code)})}_setupTuningListeners(){e.on(t.TUNING_UPDATED,()=>{let e=i.currentTuning;e.tires_and_brakes?.tireCompound;let t=e.tires_and_brakes?.frontTirePressurePsi||27.5;this.wheels.fl.pressurePsi=t,this.wheels.fr.pressurePsi=t,this.wheels.rl.pressurePsi=e.tires_and_brakes?.rearTirePressurePsi||26,this.wheels.rr.pressurePsi=e.tires_and_brakes?.rearTirePressurePsi||26}),e.on(t.STAGE_SELECTED,()=>{this.resetVehicle()}),e.on(t.STAGE_COMPILED,()=>{this.resetVehicle()})}setStageSpline(e){this.stageSpline=e}start(){this.isRunning=!0,this.lastTime=performance.now(),this._simulateLoop()}stop(){this.isRunning=!1}_simulateLoop=()=>{if(!this.isRunning)return;let e=performance.now(),t=Math.min((e-this.lastTime)/1e3,.05);this.lastTime=e,this._pollInputs(t),this._stepPhysics(t),this._broadcastTelemetry(e),requestAnimationFrame(this._simulateLoop)};_pollInputs(e){let t=this.keysDown.has(`KeyW`)||this.keysDown.has(`ArrowUp`),n=this.keysDown.has(`KeyS`)||this.keysDown.has(`ArrowDown`),r=this.keysDown.has(`KeyA`)||this.keysDown.has(`ArrowLeft`),i=this.keysDown.has(`KeyD`)||this.keysDown.has(`ArrowRight`),a=this.keysDown.has(`Space`),o=r?-1:+!!i;this.inputs.steer+=(o-this.inputs.steer)*Math.min(1,e*3.5*4);let s=+!!t;this.inputs.throttle+=(s-this.inputs.throttle)*Math.min(1,e*6);let c=+!!n;this.inputs.brake+=(c-this.inputs.brake)*Math.min(1,e*8),this.inputs.handbrake=+!!a}_stepPhysics(n){this.tickCount++;let r=i.currentTuning,a=i.activeStage,o=a?.surfaceGripCoefficient||.95;this.steeringAngleDeg=this.inputs.steer*32,this.wheels.fl.steerAngleDeg=this.steeringAngleDeg,this.wheels.fr.steerAngleDeg=this.steeringAngleDeg;let s=r.engine?.idleRpm||1200,c=r.engine?.redlineRpm||7800,l=r.engine?.maxRpm||8400,u=r.engine?.peakBoostBar||2.45;if(this.inputs.throttle>.1){let e=2.8*(this.engineRpm/5e3);this.turboBoostBar=Math.min(u,this.turboBoostBar+n*e*this.inputs.throttle)}else this.turboBoostBar=Math.max(0,this.turboBoostBar-n*4.2);this.peakBoostBar=Math.max(this.peakBoostBar,this.turboBoostBar),this.inputs.isAutomatic&&(this.engineRpm>c-200&&this.gear<6?this.shiftGear(1):this.engineRpm<2800&&this.gear>1&&this.speedKph<140&&this.shiftGear(-1));let d=(r.transmission?.gearRatios?.[this.gear-1]||2.4)*(r.transmission?.finalDriveRatio||4.18),f=.32,p=Math.max(s,this.speedMs/f*d*(60/(2*Math.PI)));this.engineRpm+=(p-this.engineRpm)*Math.min(1,n*8),this.engineRpm>l&&(this.engineRpm=l,Math.random()<.3&&e.emit(t.BACKFIRE_POP));let m=r.engine?.peakTorqueNm||520,h=1+this.turboBoostBar/u*.45,g=this.inputs.throttle*m*h*d;(r.differential?.centerTorqueSplitFront||42)/100,(r.differential?.centerTorqueSplitRear||58)/100,(r.differential?.rearAccelLock||75)/100;let _=r.tires_and_brakes?.maxBrakeTorqueNm||3800,v=(r.tires_and_brakes?.brakeBiasFrontPercent||63)/100,y=this.inputs.handbrake*(r.tires_and_brakes?.handbrakeTorqueNm||4600),b=this.inputs.brake*_*v,x=this.inputs.brake*_*(1-v)+y;1.1025*this.speedMs**2*.42;let S=.6125*2.2*this.speedMs**2*.38,C=(g/f*o-(b+x)/f-S)/1230;this.speedMs=Math.max(0,this.speedMs+C*n),this.speedKph=this.speedMs*3.6;let w=this.steeringAngleDeg*(this.speedMs*.045);this.inputs.handbrake>.5&&this.speedMs>5?this.driftAngleDeg+=(this.steeringAngleDeg>0?32:-32)*n*3.5:this.driftAngleDeg*=.1**n,this.driftAngleDeg=Math.max(-65,Math.min(65,this.driftAngleDeg)),this.angularVelocity.yaw=w+this.driftAngleDeg*.05,this.rotation.yaw+=this.angularVelocity.yaw*n;let T=this.speedMs*(this.angularVelocity.yaw*Math.PI/180)/9.81;this.gForces.lateralG+=(T-this.gForces.lateralG)*Math.min(1,n*10),this.gForces.longitudinalG+=(C/9.81-this.gForces.longitudinalG)*Math.min(1,n*10),this.gForces.yawRateDegS=this.angularVelocity.yaw,r.suspension?.frontSpringRate,r.suspension?.rearSpringRate;let E=r.suspension?.frontRideHeight||140,D=r.suspension?.rearRideHeight||150,O=this.gForces.longitudinalG*35,k=this.gForces.lateralG*42;this._updateWheelSuspension(this.wheels.fl,E-O+k,n),this._updateWheelSuspension(this.wheels.fr,E-O-k,n),this._updateWheelSuspension(this.wheels.rl,D+O+k,n),this._updateWheelSuspension(this.wheels.rr,D+O-k,n);for(let e of[`fl`,`fr`,`rl`,`rr`]){let t=this.wheels[e],r=Math.abs(t.slipAngleDeg)/15+(this.speedMs>10?.2:0);t.gripUtilPct=Math.min(100,Math.round(r*75+Math.abs(this.gForces.lateralG)*20));let i=t.gripUtilPct/100*1.8*(this.speedMs/20),a=(t.surfaceTempC-20)*.04;t.surfaceTempC=Math.max(20,Math.min(135,t.surfaceTempC+(i-a)*n)),t.coreTempC+=(t.surfaceTempC-t.coreTempC)*n*.15,t.rotationRad+=this.speedMs/f*n}if(this.stageDistanceM+=this.speedMs*n,this.stageTimeSec+=n,this._checkPacenotes(a),this.stageSpline&&typeof this.stageSpline.getPointAtDistance==`function`){let e=this.stageSpline.getPointAtDistance(this.stageDistanceM);e&&(this.position.x=e.x,this.position.y=e.y+.35,this.position.z=e.z,this.rotation.yaw=e.heading||this.rotation.yaw)}else{let e=this.rotation.yaw*(Math.PI/180);this.position.x+=Math.sin(e)*this.speedMs*n,this.position.z+=Math.cos(e)*this.speedMs*n}}_updateWheelSuspension(n,r,i){let a=Math.max(10,Math.min(n.maxTravelMm,r));n.damperVelocityMs=(a-n.suspensionTravelMm)/1e3/i,n.suspensionTravelMm=a,n.compressionPct=Math.round((1-a/n.maxTravelMm)*100),n.suspensionTravelMm<20?(n.bottomedOut||e.emit(t.BOTTOM_OUT,{wheelId:n.id}),n.bottomedOut=!0):n.bottomedOut=!1,n.slipAngleDeg=this.steeringAngleDeg-this.driftAngleDeg}_checkPacenotes(n){if(n&&n.pacenotes&&n.pacenotes.length!==0)for(let r=0;r<n.pacenotes.length;r++){let i=n.pacenotes[r],a=i.distance-90;if(this.stageDistanceM>=a&&this.lastPacenoteIndex<r){this.lastPacenoteIndex=r,e.emit(t.PACENOTE_TRIGGER,i);break}}}shiftGear(n){let r=Math.max(1,Math.min(6,this.gear+n));r!==this.gear&&(this.gear=r,n>0?(this.engineRpm=Math.max(1800,this.engineRpm*.72),e.emit(t.GEAR_SHIFT,{gear:this.gear,direction:`up`}),this.turboBoostBar>.8&&(e.emit(t.TURBO_BLOWOFF),e.emit(t.BACKFIRE_POP))):(this.engineRpm=Math.min(7800,this.engineRpm*1.35),e.emit(t.GEAR_SHIFT,{gear:this.gear,direction:`down`})))}resetVehicle(){this.position={x:0,y:.5,z:0},this.velocity={x:0,y:0,z:0},this.speedKph=0,this.speedMs=0,this.engineRpm=1250,this.gear=1,this.turboBoostBar=0,this.driftAngleDeg=0,this.stageDistanceM=0,this.stageTimeSec=0,this.lastPacenoteIndex=-1}_broadcastTelemetry(n){let r=i.activeStage,a=r?.pacenotes?.[this.lastPacenoteIndex+1]||null,o={timestamp:n,tick:this.tickCount,vehicle:{speedKph:Math.round(this.speedKph*10)/10,speedMph:Math.round(this.speedKph*.621371*10)/10,engineRpm:Math.round(this.engineRpm),gear:this.gear,throttle:Math.round(this.inputs.throttle*100)/100,brake:Math.round(this.inputs.brake*100)/100,clutch:Math.round(this.inputs.clutch*100)/100,handbrake:Math.round(this.inputs.handbrake*100)/100,steeringAngleDeg:Math.round(this.steeringAngleDeg*10)/10,turboBoostBar:Math.round(this.turboBoostBar*100)/100,peakBoostBar:Math.round(this.peakBoostBar*100)/100,antiLagActive:this.inputs.throttle<.2&&this.turboBoostBar>.8,limiterActive:this.engineRpm>=7800},gForces:{lateralG:Math.round(this.gForces.lateralG*100)/100,longitudinalG:Math.round(this.gForces.longitudinalG*100)/100,verticalG:Math.round(this.gForces.verticalG*100)/100,yawRateDegS:Math.round(this.gForces.yawRateDegS*10)/10},suspension:{fl:{travelMm:Math.round(this.wheels.fl.suspensionTravelMm),maxTravelMm:this.wheels.fl.maxTravelMm,compressionPct:this.wheels.fl.compressionPct,damperVelocityMs:Math.round(this.wheels.fl.damperVelocityMs*100)/100,bottomedOut:this.wheels.fl.bottomedOut},fr:{travelMm:Math.round(this.wheels.fr.suspensionTravelMm),maxTravelMm:this.wheels.fr.maxTravelMm,compressionPct:this.wheels.fr.compressionPct,damperVelocityMs:Math.round(this.wheels.fr.damperVelocityMs*100)/100,bottomedOut:this.wheels.fr.bottomedOut},rl:{travelMm:Math.round(this.wheels.rl.suspensionTravelMm),maxTravelMm:this.wheels.rl.maxTravelMm,compressionPct:this.wheels.rl.compressionPct,damperVelocityMs:Math.round(this.wheels.rl.damperVelocityMs*100)/100,bottomedOut:this.wheels.rl.bottomedOut},rr:{travelMm:Math.round(this.wheels.rr.suspensionTravelMm),maxTravelMm:this.wheels.rr.maxTravelMm,compressionPct:this.wheels.rr.compressionPct,damperVelocityMs:Math.round(this.wheels.rr.damperVelocityMs*100)/100,bottomedOut:this.wheels.rr.bottomedOut}},tires:{fl:{coreTempC:Math.round(this.wheels.fl.coreTempC*10)/10,surfaceTempC:Math.round(this.wheels.fl.surfaceTempC*10)/10,pressurePsi:this.wheels.fl.pressurePsi,slipAngleDeg:Math.round(this.wheels.fl.slipAngleDeg*10)/10,gripUtilPct:this.wheels.fl.gripUtilPct,surfaceContact:!0},fr:{coreTempC:Math.round(this.wheels.fr.coreTempC*10)/10,surfaceTempC:Math.round(this.wheels.fr.surfaceTempC*10)/10,pressurePsi:this.wheels.fr.pressurePsi,slipAngleDeg:Math.round(this.wheels.fr.slipAngleDeg*10)/10,gripUtilPct:this.wheels.fr.gripUtilPct,surfaceContact:!0},rl:{coreTempC:Math.round(this.wheels.rl.coreTempC*10)/10,surfaceTempC:Math.round(this.wheels.rl.surfaceTempC*10)/10,pressurePsi:this.wheels.rl.pressurePsi,slipAngleDeg:Math.round(this.wheels.rl.slipAngleDeg*10)/10,gripUtilPct:this.wheels.rl.gripUtilPct,surfaceContact:!0},rr:{coreTempC:Math.round(this.wheels.rr.coreTempC*10)/10,surfaceTempC:Math.round(this.wheels.rr.surfaceTempC*10)/10,pressurePsi:this.wheels.rr.pressurePsi,slipAngleDeg:Math.round(this.wheels.rr.slipAngleDeg*10)/10,gripUtilPct:this.wheels.rr.gripUtilPct,surfaceContact:!0}},stageProgress:{currentDistanceM:Math.round(this.stageDistanceM),totalDistanceM:r?.totalLengthMeters||4200,progressPercent:Math.min(100,Math.round(this.stageDistanceM/(r?.totalLengthMeters||4200)*100)),elapsedTimeSec:Math.round(this.stageTimeSec*10)/10,activePacenote:a?{call:a.call,distanceToApexM:Math.max(0,Math.round(a.distance-this.stageDistanceM)),severity:a.severity,direction:a.direction,modifier:a.modifier,detail:a.detail}:null}};e.emit(t.TELEMETRY_UPDATE,o)}},o=new class{constructor(){this.audioCtx=null,this.isMuted=!1,this.masterGain=null,this.engineOsc1=null,this.engineOsc2=null,this.engineFilter=null,this.engineGain=null,this.turboOsc=null,this.turboGain=null,this.turboFilter=null,this.gravelNoiseNode=null,this.gravelGain=null,this.tireSquealNode=null,this.tireSquealGain=null,this.lastThrottle=0,this.lastBoost=0,this.lastShiftTime=0,this.speechAvailable=typeof window<`u`&&`speechSynthesis`in window,this._setupEventListeners()}initAudioContext(){if(!this.audioCtx)try{let e=window.AudioContext||window.webkitAudioContext;this.audioCtx=new e,this.masterGain=this.audioCtx.createGain(),this.masterGain.gain.setValueAtTime(.4,this.audioCtx.currentTime),this.masterGain.connect(this.audioCtx.destination),this._initEngineAudio(),this._initTurboAudio(),this._initGravelAudio(),this._initTireAudio()}catch(e){console.warn(`[RallyAudio] Web Audio initialization failed or blocked:`,e)}}_initEngineAudio(){this.engineOsc1=this.audioCtx.createOscillator(),this.engineOsc1.type=`sawtooth`,this.engineOsc1.frequency.setValueAtTime(50,this.audioCtx.currentTime),this.engineOsc2=this.audioCtx.createOscillator(),this.engineOsc2.type=`triangle`,this.engineOsc2.frequency.setValueAtTime(100,this.audioCtx.currentTime),this.engineFilter=this.audioCtx.createBiquadFilter(),this.engineFilter.type=`lowpass`,this.engineFilter.frequency.setValueAtTime(450,this.audioCtx.currentTime),this.engineFilter.Q.setValueAtTime(3.5,this.audioCtx.currentTime),this.engineGain=this.audioCtx.createGain(),this.engineGain.gain.setValueAtTime(.25,this.audioCtx.currentTime),this.engineOsc1.connect(this.engineFilter),this.engineOsc2.connect(this.engineFilter),this.engineFilter.connect(this.engineGain),this.engineGain.connect(this.masterGain),this.engineOsc1.start(),this.engineOsc2.start()}_initTurboAudio(){this.turboOsc=this.audioCtx.createOscillator(),this.turboOsc.type=`sine`,this.turboOsc.frequency.setValueAtTime(1400,this.audioCtx.currentTime),this.turboFilter=this.audioCtx.createBiquadFilter(),this.turboFilter.type=`bandpass`,this.turboFilter.frequency.setValueAtTime(2200,this.audioCtx.currentTime),this.turboFilter.Q.setValueAtTime(8,this.audioCtx.currentTime),this.turboGain=this.audioCtx.createGain(),this.turboGain.gain.setValueAtTime(0,this.audioCtx.currentTime),this.turboOsc.connect(this.turboFilter),this.turboFilter.connect(this.turboGain),this.turboGain.connect(this.masterGain),this.turboOsc.start()}_createNoiseBuffer(){let e=this.audioCtx.sampleRate*2,t=this.audioCtx.createBuffer(1,e,this.audioCtx.sampleRate),n=t.getChannelData(0);for(let t=0;t<e;t++)n[t]=Math.random()*2-1;return t}_initGravelAudio(){let e=this._createNoiseBuffer(),t=this.audioCtx.createBufferSource();t.buffer=e,t.loop=!0;let n=this.audioCtx.createBiquadFilter();n.type=`bandpass`,n.frequency.setValueAtTime(1800,this.audioCtx.currentTime),n.Q.setValueAtTime(1.8,this.audioCtx.currentTime),this.gravelGain=this.audioCtx.createGain(),this.gravelGain.gain.setValueAtTime(0,this.audioCtx.currentTime),t.connect(n),n.connect(this.gravelGain),this.gravelGain.connect(this.masterGain),t.start()}_initTireAudio(){let e=this._createNoiseBuffer(),t=this.audioCtx.createBufferSource();t.buffer=e,t.loop=!0;let n=this.audioCtx.createBiquadFilter();n.type=`highpass`,n.frequency.setValueAtTime(900,this.audioCtx.currentTime),this.tireSquealGain=this.audioCtx.createGain(),this.tireSquealGain.gain.setValueAtTime(0,this.audioCtx.currentTime),t.connect(n),n.connect(this.tireSquealGain),this.tireSquealGain.connect(this.masterGain),t.start()}_setupEventListeners(){e.on(t.TELEMETRY_UPDATE,e=>{this.updateFromTelemetry(e)}),e.on(t.BACKFIRE_POP,()=>{this.triggerBackfirePop()}),e.on(t.TURBO_BLOWOFF,()=>{this.triggerBlowOffValve()}),e.on(t.PACENOTE_TRIGGER,e=>{this.speakPacenote(e)})}updateFromTelemetry(e){if(!this.audioCtx||this.isMuted)return;let t=this.audioCtx.currentTime,{vehicle:n,tires:r,gForces:i}=e,a=n.engineRpm||1200,o=n.throttle||0,s=a/60*2;this.engineOsc1.frequency.setTargetAtTime(s,t,.04),this.engineOsc2.frequency.setTargetAtTime(s*2,t,.04);let c=250+a/8e3*1200+o*800;this.engineFilter.frequency.setTargetAtTime(c,t,.04);let l=.12+o*.22+a/8e3*.15;this.engineGain.gain.setTargetAtTime(l,t,.04);let u=n.turboBoostBar||0,d=1100+u*2800;this.turboOsc.frequency.setTargetAtTime(d,t,.06),this.turboGain.gain.setTargetAtTime(Math.max(0,u*.18),t,.06),this.lastThrottle>.65&&o<.15&&this.lastBoost>.8&&this.triggerBlowOffValve(),this.lastThrottle=o,this.lastBoost=u;let f=Math.max(Math.abs(r.fl?.slipAngleDeg||0),Math.abs(r.fr?.slipAngleDeg||0),Math.abs(r.rl?.slipAngleDeg||0),Math.abs(r.rr?.slipAngleDeg||0)),p=Math.min(1,f/20);this.tireSquealGain.gain.setTargetAtTime(p*.28,t,.05);let m=n.speedKph||0,h=Math.min(.24,m/160*.24*(1+p));this.gravelGain.gain.setTargetAtTime(h,t,.1)}triggerBlowOffValve(){if(!this.audioCtx||this.isMuted)return;let e=this.audioCtx.currentTime,t=this.audioCtx.createBufferSource();t.buffer=this._createNoiseBuffer();let n=this.audioCtx.createBiquadFilter();n.type=`bandpass`,n.frequency.setValueAtTime(3200,e),n.frequency.exponentialRampToValueAtTime(1400,e+.35);let r=this.audioCtx.createGain();r.gain.setValueAtTime(.35,e),r.gain.exponentialRampToValueAtTime(.001,e+.4),t.connect(n),n.connect(r),r.connect(this.masterGain),t.start(e),t.stop(e+.45)}triggerBackfirePop(){if(!this.audioCtx||this.isMuted)return;let e=this.audioCtx.currentTime,t=this.audioCtx.createOscillator();t.type=`triangle`,t.frequency.setValueAtTime(140,e),t.frequency.exponentialRampToValueAtTime(35,e+.12);let n=this.audioCtx.createBufferSource();n.buffer=this._createNoiseBuffer();let r=this.audioCtx.createGain();r.gain.setValueAtTime(.45,e),r.gain.exponentialRampToValueAtTime(.001,e+.15),t.connect(r),n.connect(r),r.connect(this.masterGain),t.start(e),n.start(e),t.stop(e+.16),n.stop(e+.16)}speakPacenote(e){if(i.hudSettings.audioCoDriverEnabled&&!this.isMuted){if(this.speechAvailable&&window.speechSynthesis)try{window.speechSynthesis.cancel();let t=new SpeechSynthesisUtterance(e.call||``);t.rate=1.35,t.pitch=1.05,t.volume=i.hudSettings.coDriverVolume||.85;let n=window.speechSynthesis.getVoices(),r=n.find(e=>e.lang.startsWith(`en`))||n[0];r&&(t.voice=r),window.speechSynthesis.speak(t)}catch(e){console.warn(`[RallyAudio] Speech synthesis error:`,e)}else this.playRadioChime()}}playRadioChime(){if(!this.audioCtx)return;let e=this.audioCtx.currentTime,t=this.audioCtx.createOscillator();t.type=`sine`,t.frequency.setValueAtTime(880,e),t.frequency.setValueAtTime(1174,e+.08);let n=this.audioCtx.createGain();n.gain.setValueAtTime(.15,e),n.gain.exponentialRampToValueAtTime(.001,e+.25),t.connect(n),n.connect(this.masterGain),t.start(e),t.stop(e+.28)}toggleMute(){return this.isMuted=!this.isMuted,this.masterGain&&this.masterGain.gain.setValueAtTime(this.isMuted?0:.4,this.audioCtx?.currentTime||0),this.isMuted}},s=1e3,c=1001,l=1002,u=1003,d=1004,f=1005,p=1006,m=1007,h=1008,g=1009,_=1010,v=1011,y=1012,b=1013,x=1014,S=1015,C=1016,w=1017,T=1018,E=1020,D=35902,O=35899,k=1021,A=1022,j=1023,M=1026,N=1027,P=1028,ee=1029,F=1030,te=1031,ne=1033,re=33776,ie=33777,ae=33778,oe=33779,se=35840,I=35841,ce=35842,le=35843,ue=36196,de=37492,fe=37496,pe=37488,me=37489,he=37490,ge=37491,_e=37808,ve=37809,ye=37810,be=37811,xe=37812,Se=37813,Ce=37814,we=37815,Te=37816,Ee=37817,De=37818,Oe=37819,ke=37820,Ae=37821,je=36492,L=36494,Me=36495,Ne=36283,Pe=36284,R=36285,Fe=36286,z=2300,Ie=2301,Le=2302,Re=2303,ze=2400,Be=2401,Ve=2402,He=3200,Ue=`srgb`,We=`srgb-linear`,Ge=`linear`,Ke=`srgb`,qe=7680,Je=35044,Ye=35048,Xe=2e3;function Ze(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Qe(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function $e(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function et(){let e=$e(`canvas`);return e.style.display=`block`,e}var tt={};function nt(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function rt(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function B(...e){e=rt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function V(...e){e=rt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function it(...e){let t=e.join(` `);t in tt||(tt[t]=!0,B(...e))}function at(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var ot={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},st=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},ct=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),lt=1234567,ut=Math.PI/180,dt=180/Math.PI;function ft(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(ct[e&255]+ct[e>>8&255]+ct[e>>16&255]+ct[e>>24&255]+`-`+ct[t&255]+ct[t>>8&255]+`-`+ct[t>>16&15|64]+ct[t>>24&255]+`-`+ct[n&63|128]+ct[n>>8&255]+`-`+ct[n>>16&255]+ct[n>>24&255]+ct[r&255]+ct[r>>8&255]+ct[r>>16&255]+ct[r>>24&255]).toLowerCase()}function H(e,t,n){return Math.max(t,Math.min(n,e))}function pt(e,t){return(e%t+t)%t}function mt(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function ht(e,t,n){return e===t?0:(n-e)/(t-e)}function gt(e,t,n){return(1-n)*e+n*t}function _t(e,t,n,r){return gt(e,t,1-Math.exp(-n*r))}function vt(e,t=1){return t-Math.abs(pt(e,t*2)-t)}function yt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function bt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function xt(e,t){return e+Math.floor(Math.random()*(t-e+1))}function St(e,t){return e+Math.random()*(t-e)}function Ct(e){return e*(.5-Math.random())}function wt(e){e!==void 0&&(lt=e);let t=lt+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Tt(e){return e*ut}function Et(e){return e*dt}function Dt(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function Ot(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function kt(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function At(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:B(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function jt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Mt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var Nt={DEG2RAD:ut,RAD2DEG:dt,generateUUID:ft,clamp:H,euclideanModulo:pt,mapLinear:mt,inverseLerp:ht,lerp:gt,damp:_t,pingpong:vt,smoothstep:yt,smootherstep:bt,randInt:xt,randFloat:St,randFloatSpread:Ct,seededRandom:wt,degToRad:Tt,radToDeg:Et,isPowerOfTwo:Dt,ceilPowerOfTwo:Ot,floorPowerOfTwo:kt,setQuaternionFromProperEuler:At,normalize:Mt,denormalize:jt},U=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=H(this.x,e.x,t.x),this.y=H(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=H(this.x,e,t),this.y=H(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(H(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(H(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Pt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:B(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(H(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},W=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(It.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(It.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=H(this.x,e.x,t.x),this.y=H(this.y,e.y,t.y),this.z=H(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=H(this.x,e,t),this.y=H(this.y,e,t),this.z=H(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(H(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ft.copy(this).projectOnVector(e),this.sub(Ft)}reflect(e){return this.sub(Ft.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(H(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ft=new W,It=new Pt,G=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return it(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Lt.makeScale(e,t)),this}rotate(e){return it(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Lt.makeRotation(-e)),this}translate(e,t){return it(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Lt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Lt=new G,Rt=new G().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zt=new G().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Bt(){let e={enabled:!0,workingColorSpace:We,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Ht(e.r),e.g=Ht(e.g),e.b=Ht(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Ut(e.r),e.g=Ut(e.g),e.b=Ut(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Ge:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return it(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return it(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[We]:{primaries:t,whitePoint:r,transfer:Ge,toXYZ:Rt,fromXYZ:zt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Ue},outputColorSpaceConfig:{drawingBufferColorSpace:Ue}},[Ue]:{primaries:t,whitePoint:r,transfer:Ke,toXYZ:Rt,fromXYZ:zt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Ue}}}),e}var Vt=Bt();function Ht(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Ut(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Wt,Gt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Wt===void 0&&(Wt=$e(`canvas`)),Wt.width=e.width,Wt.height=e.height;let t=Wt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Wt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=$e(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Ht(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Ht(t[e]/255)*255):t[e]=Ht(t[e]);return{data:t,width:e.width,height:e.height}}return B(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Kt=0,qt=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Kt++}),this.uuid=ft(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Jt(r[t].image)):e.push(Jt(r[t]))}else e=Jt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Jt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Gt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(B(`Texture: Unable to serialize Texture.`),{})}var Yt=0,Xt=new W,Zt=class e extends st{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=c,i=c,a=p,o=h,s=j,l=g,u=e.DEFAULT_ANISOTROPY,d=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yt++}),this.uuid=ft(),this.name=``,this.source=new qt(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=u,this.format=s,this.internalFormat=null,this.type=l,this.offset=new U(0,0),this.repeat=new U(1,1),this.center=new U(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new G,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Xt).x}get height(){return this.source.getSize(Xt).y}get depth(){return this.source.getSize(Xt).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){B(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?B(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case s:e.x-=Math.floor(e.x);break;case c:e.x=e.x<0?0:1;break;case l:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case s:e.y-=Math.floor(e.y);break;case c:e.y=e.y<0?0:1;break;case l:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Zt.DEFAULT_IMAGE=null,Zt.DEFAULT_MAPPING=300,Zt.DEFAULT_ANISOTROPY=1;var Qt=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=H(this.x,e.x,t.x),this.y=H(this.y,e.y,t.y),this.z=H(this.z,e.z,t.z),this.w=H(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=H(this.x,e,t),this.y=H(this.y,e,t),this.z=H(this.z,e,t),this.w=H(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(H(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},$t=class extends st{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:p,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Qt(0,0,e,t),this.scissorTest=!1,this.viewport=new Qt(0,0,e,t),this.textures=[];let r=new Zt({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:p,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new qt(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},en=class extends $t{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},tn=class extends Zt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=u,this.minFilter=u,this.wrapR=c,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},nn=class extends Zt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=u,this.minFilter=u,this.wrapR=c,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},rn=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/an.setFromMatrixColumn(e,0).length(),i=1/an.setFromMatrixColumn(e,1).length(),a=1/an.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(sn,e,cn)}lookAt(e,t,n){let r=this.elements;return dn.subVectors(e,t),dn.lengthSq()===0&&(dn.z=1),dn.normalize(),ln.crossVectors(n,dn),ln.lengthSq()===0&&(Math.abs(n.z)===1?dn.x+=1e-4:dn.z+=1e-4,dn.normalize(),ln.crossVectors(n,dn)),ln.normalize(),un.crossVectors(dn,ln),r[0]=ln.x,r[4]=un.x,r[8]=dn.x,r[1]=ln.y,r[5]=un.y,r[9]=dn.y,r[2]=ln.z,r[6]=un.z,r[10]=dn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],P=r[7],ee=r[11],F=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*P,i[8]=a*C+o*D+s*j+c*ee,i[12]=a*w+o*O+s*M+c*F,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*P,i[9]=l*C+u*D+d*j+f*ee,i[13]=l*w+u*O+d*M+f*F,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*P,i[10]=p*C+m*D+h*j+g*ee,i[14]=p*w+m*O+h*M+g*F,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*P,i[11]=_*C+v*D+y*j+b*ee,i[15]=_*w+v*O+y*M+b*F,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=an.set(r[0],r[1],r[2]).length(),o=an.set(r[4],r[5],r[6]).length(),s=an.set(r[8],r[9],r[10]).length();i<0&&(a=-a),on.copy(this);let c=1/a,l=1/o,u=1/s;return on.elements[0]*=c,on.elements[1]*=c,on.elements[2]*=c,on.elements[4]*=l,on.elements[5]*=l,on.elements[6]*=l,on.elements[8]*=u,on.elements[9]*=u,on.elements[10]*=u,t.setFromRotationMatrix(on),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Xe,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Xe,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},an=new W,on=new rn,sn=new W(0,0,0),cn=new W(1,1,1),ln=new W,un=new W,dn=new W,fn=new rn,pn=new Pt,mn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(H(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-H(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(H(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-H(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(H(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-H(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:B(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return fn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(fn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return pn.setFromEuler(this),this.setFromQuaternion(pn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};mn.DEFAULT_ORDER=`XYZ`;var hn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},gn=0,_n=new W,vn=new Pt,yn=new rn,bn=new W,xn=new W,Sn=new W,Cn=new Pt,wn=new W(1,0,0),Tn=new W(0,1,0),En=new W(0,0,1),Dn={type:`added`},On={type:`removed`},kn={type:`childadded`,child:null},An={type:`childremoved`,child:null},jn=class e extends st{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:gn++}),this.uuid=ft(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new W,n=new mn,r=new Pt,i=new W(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new rn},normalMatrix:{value:new G}}),this.matrix=new rn,this.matrixWorld=new rn,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new hn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return vn.setFromAxisAngle(e,t),this.quaternion.multiply(vn),this}rotateOnWorldAxis(e,t){return vn.setFromAxisAngle(e,t),this.quaternion.premultiply(vn),this}rotateX(e){return this.rotateOnAxis(wn,e)}rotateY(e){return this.rotateOnAxis(Tn,e)}rotateZ(e){return this.rotateOnAxis(En,e)}translateOnAxis(e,t){return _n.copy(e).applyQuaternion(this.quaternion),this.position.add(_n.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wn,e)}translateY(e){return this.translateOnAxis(Tn,e)}translateZ(e){return this.translateOnAxis(En,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(yn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?bn.copy(e):bn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),xn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yn.lookAt(xn,bn,this.up):yn.lookAt(bn,xn,this.up),this.quaternion.setFromRotationMatrix(yn),r&&(yn.extractRotation(r.matrixWorld),vn.setFromRotationMatrix(yn),this.quaternion.premultiply(vn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(V(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Dn),kn.child=e,this.dispatchEvent(kn),kn.child=null):V(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(On),An.child=e,this.dispatchEvent(An),An.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),yn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),yn.multiply(e.parent.matrixWorld)),e.applyMatrix4(yn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Dn),kn.child=e,this.dispatchEvent(kn),kn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xn,e,Sn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xn,Cn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};jn.DEFAULT_UP=new W(0,1,0),jn.DEFAULT_MATRIX_AUTO_UPDATE=!0,jn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Mn=class extends jn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Nn={type:`move`},Pn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Mn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Mn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Mn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Nn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Mn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Fn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},In={h:0,s:0,l:0},Ln={h:0,s:0,l:0};function Rn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var K=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ue){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Vt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Vt.workingColorSpace){return this.r=e,this.g=t,this.b=n,Vt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Vt.workingColorSpace){if(e=pt(e,1),t=H(t,0,1),n=H(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Rn(i,r,e+1/3),this.g=Rn(i,r,e),this.b=Rn(i,r,e-1/3)}return Vt.colorSpaceToWorking(this,r),this}setStyle(e,t=Ue){function n(t){t!==void 0&&parseFloat(t)<1&&B(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:B(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);B(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ue){let n=Fn[e.toLowerCase()];return n===void 0?B(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ht(e.r),this.g=Ht(e.g),this.b=Ht(e.b),this}copyLinearToSRGB(e){return this.r=Ut(e.r),this.g=Ut(e.g),this.b=Ut(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ue){return Vt.workingToColorSpace(zn.copy(this),e),Math.round(H(zn.r*255,0,255))*65536+Math.round(H(zn.g*255,0,255))*256+Math.round(H(zn.b*255,0,255))}getHexString(e=Ue){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Vt.workingColorSpace){Vt.workingToColorSpace(zn.copy(this),t);let n=zn.r,r=zn.g,i=zn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Vt.workingColorSpace){return Vt.workingToColorSpace(zn.copy(this),t),e.r=zn.r,e.g=zn.g,e.b=zn.b,e}getStyle(e=Ue){Vt.workingToColorSpace(zn.copy(this),e);let t=zn.r,n=zn.g,r=zn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(In),this.setHSL(In.h+e,In.s+t,In.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(In),e.getHSL(Ln);let n=gt(In.h,Ln.h,t),r=gt(In.s,Ln.s,t),i=gt(In.l,Ln.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},zn=new K;K.NAMES=Fn;var Bn=class e{constructor(e,t=25e-5){this.isFogExp2=!0,this.name=``,this.color=new K(e),this.density=t}clone(){return new e(this.color,this.density)}toJSON(){return{type:`FogExp2`,name:this.name,color:this.color.getHex(),density:this.density}}},Vn=class extends jn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new mn,this.environmentIntensity=1,this.environmentRotation=new mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Hn=new W,Un=new W,Wn=new W,Gn=new W,Kn=new W,qn=new W,Jn=new W,Yn=new W,Xn=new W,Zn=new W,Qn=new Qt,$n=new Qt,er=new Qt,tr=class e{constructor(e=new W,t=new W,n=new W){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Hn.subVectors(e,t),r.cross(Hn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Hn.subVectors(r,t),Un.subVectors(n,t),Wn.subVectors(e,t);let a=Hn.dot(Hn),o=Hn.dot(Un),s=Hn.dot(Wn),c=Un.dot(Un),l=Un.dot(Wn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Gn)!==null&&Gn.x>=0&&Gn.y>=0&&Gn.x+Gn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Gn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Gn.x),s.addScaledVector(a,Gn.y),s.addScaledVector(o,Gn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Qn.setScalar(0),$n.setScalar(0),er.setScalar(0),Qn.fromBufferAttribute(e,t),$n.fromBufferAttribute(e,n),er.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Qn,i.x),a.addScaledVector($n,i.y),a.addScaledVector(er,i.z),a}static isFrontFacing(e,t,n,r){return Hn.subVectors(n,t),Un.subVectors(e,t),Hn.cross(Un).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Hn.subVectors(this.c,this.b),Un.subVectors(this.a,this.b),Hn.cross(Un).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Kn.subVectors(r,n),qn.subVectors(i,n),Yn.subVectors(e,n);let s=Kn.dot(Yn),c=qn.dot(Yn);if(s<=0&&c<=0)return t.copy(n);Xn.subVectors(e,r);let l=Kn.dot(Xn),u=qn.dot(Xn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Kn,a);Zn.subVectors(e,i);let f=Kn.dot(Zn),p=qn.dot(Zn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(qn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Jn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Jn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Kn,a).addScaledVector(qn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},nr=class{constructor(e=new W(1/0,1/0,1/0),t=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ir.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ir.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ir.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,ir):ir.fromBufferAttribute(r,t),ir.applyMatrix4(e.matrixWorld),this.expandByPoint(ir);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),ar.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),ar.copy(e.boundingBox)),ar.applyMatrix4(e.matrixWorld),this.union(ar)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ir),ir.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(fr),pr.subVectors(this.max,fr),or.subVectors(e.a,fr),sr.subVectors(e.b,fr),cr.subVectors(e.c,fr),lr.subVectors(sr,or),ur.subVectors(cr,sr),dr.subVectors(or,cr);let t=[0,-lr.z,lr.y,0,-ur.z,ur.y,0,-dr.z,dr.y,lr.z,0,-lr.x,ur.z,0,-ur.x,dr.z,0,-dr.x,-lr.y,lr.x,0,-ur.y,ur.x,0,-dr.y,dr.x,0];return!gr(t,or,sr,cr,pr)||(t=[1,0,0,0,1,0,0,0,1],!gr(t,or,sr,cr,pr))?!1:(mr.crossVectors(lr,ur),t=[mr.x,mr.y,mr.z],gr(t,or,sr,cr,pr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ir).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ir).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(rr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),rr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),rr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),rr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),rr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),rr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),rr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),rr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(rr)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},rr=[new W,new W,new W,new W,new W,new W,new W,new W],ir=new W,ar=new nr,or=new W,sr=new W,cr=new W,lr=new W,ur=new W,dr=new W,fr=new W,pr=new W,mr=new W,hr=new W;function gr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){hr.fromArray(e,a);let o=i.x*Math.abs(hr.x)+i.y*Math.abs(hr.y)+i.z*Math.abs(hr.z),s=t.dot(hr),c=n.dot(hr),l=r.dot(hr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var _r=new W,vr=new U,yr=0,br=class extends st{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:yr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Je,this.updateRanges=[],this.gpuType=S,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)vr.fromBufferAttribute(this,t),vr.applyMatrix3(e),this.setXY(t,vr.x,vr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.applyMatrix3(e),this.setXYZ(t,_r.x,_r.y,_r.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.applyMatrix4(e),this.setXYZ(t,_r.x,_r.y,_r.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.applyNormalMatrix(e),this.setXYZ(t,_r.x,_r.y,_r.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.transformDirection(e),this.setXYZ(t,_r.x,_r.y,_r.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=jt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Mt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=jt(t,this.array)),t}setX(e,t){return this.normalized&&(t=Mt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=jt(t,this.array)),t}setY(e,t){return this.normalized&&(t=Mt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=jt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Mt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=jt(t,this.array)),t}setW(e,t){return this.normalized&&(t=Mt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Mt(t,this.array),n=Mt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Mt(t,this.array),n=Mt(n,this.array),r=Mt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Mt(t,this.array),n=Mt(n,this.array),r=Mt(r,this.array),i=Mt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},xr=class extends br{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Sr=class extends br{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Cr=class extends br{constructor(e,t,n){super(new Float32Array(e),t,n)}},wr=new nr,Tr=new W,Er=new W,Dr=class{constructor(e=new W,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?wr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Tr.subVectors(e,this.center);let t=Tr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Tr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Er.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Tr.copy(e.center).add(Er)),this.expandByPoint(Tr.copy(e.center).sub(Er))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Or=0,kr=new rn,Ar=new jn,jr=new W,Mr=new nr,Nr=new nr,Pr=new W,Fr=class e extends st{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Or++}),this.uuid=ft(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Ze(e)?Sr:xr)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new G().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return kr.makeRotationFromQuaternion(e),this.applyMatrix4(kr),this}rotateX(e){return kr.makeRotationX(e),this.applyMatrix4(kr),this}rotateY(e){return kr.makeRotationY(e),this.applyMatrix4(kr),this}rotateZ(e){return kr.makeRotationZ(e),this.applyMatrix4(kr),this}translate(e,t,n){return kr.makeTranslation(e,t,n),this.applyMatrix4(kr),this}scale(e,t,n){return kr.makeScale(e,t,n),this.applyMatrix4(kr),this}lookAt(e){return Ar.lookAt(e),Ar.updateMatrix(),this.applyMatrix4(Ar.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(jr).negate(),this.translate(jr.x,jr.y,jr.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Cr(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&B(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new nr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)V(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Mr.setFromBufferAttribute(n),this.morphTargetsRelative?(Pr.addVectors(this.boundingBox.min,Mr.min),this.boundingBox.expandByPoint(Pr),Pr.addVectors(this.boundingBox.max,Mr.max),this.boundingBox.expandByPoint(Pr)):(this.boundingBox.expandByPoint(Mr.min),this.boundingBox.expandByPoint(Mr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&V(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Dr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)V(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new W,1/0);else if(e){let n=this.boundingSphere.center;if(Mr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Nr.setFromBufferAttribute(n),this.morphTargetsRelative?(Pr.addVectors(Mr.min,Nr.min),Mr.expandByPoint(Pr),Pr.addVectors(Mr.max,Nr.max),Mr.expandByPoint(Pr)):(Mr.expandByPoint(Nr.min),Mr.expandByPoint(Nr.max))}Mr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Pr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Pr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Pr.fromBufferAttribute(a,t),o&&(jr.fromBufferAttribute(e,t),Pr.add(jr)),r=Math.max(r,n.distanceToSquared(Pr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&V(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){V(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new br(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new W,s[e]=new W;let c=new W,l=new W,u=new W,d=new U,f=new U,p=new U,m=new W,h=new W;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new W,y=new W,b=new W,x=new W;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new br(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new W,i=new W,a=new W,o=new W,s=new W,c=new W,l=new W,u=new W;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Pr.fromBufferAttribute(e,t),Pr.normalize(),e.setXYZ(t,Pr.x,Pr.y,Pr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new br(a,r,i)}if(this.index===null)return B(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Ir=new W,Lr=new W,Rr=new G,zr=class{constructor(e=new W(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Ir.subVectors(n,t).cross(Lr.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Ir),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Rr.getNormalMatrix(e),r=this.coplanarPoint(Ir).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Br=0,Vr=class extends st{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Br++}),this.uuid=ft(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new K(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=qe,this.stencilZFail=qe,this.stencilZPass=qe,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){B(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?B(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new K().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new zr().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new U().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new U().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Hr=new W,Ur=new W,Wr=new W,Gr=new W,Kr=class{constructor(e=new W,t=new W(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Hr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Hr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Hr.copy(this.origin).addScaledVector(this.direction,t),Hr.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Ur.copy(e).add(t).multiplyScalar(.5),Wr.copy(t).sub(e).normalize(),Gr.copy(this.origin).sub(Ur);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Wr),o=Gr.dot(this.direction),s=-Gr.dot(Wr),c=Gr.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Ur).addScaledVector(Wr,d),f}intersectSphere(e,t){if(e.radius<0)return null;Hr.subVectors(e.center,this.origin);let n=Hr.dot(this.direction),r=Hr.dot(Hr)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Hr)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,N;if(y>=b&&y>=x?(w=s,D=u,A=p,N=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,N=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,N=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let P=S/w,ee=C/w,F=1/w,te=T-P*D,ne=E-ee*D,re=O-P*A,ie=k-ee*A,ae=j-P*N,oe=M-ee*N,se=ae*ie-oe*re,I=te*oe-ne*ae,ce=re*ne-ie*te;if(r){if(se<0||I<0||ce<0)return null}else if((se<0||I<0||ce<0)&&(se>0||I>0||ce>0))return null;let le=se+I+ce;if(le===0)return null;let ue=F*(se*D+I*A+ce*N);return(le>0?ue<0:ue>0)?null:this.at(ue/le,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},qr=class extends Vr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new K(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Jr=new rn,Yr=new Kr,Xr=new Dr,Zr=new W,Qr=new W,$r=new W,ei=new W,ti=new W,ni=new W,ri=new W,ii=new W,q=class extends jn{constructor(e=new Fr,t=new qr){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){ni.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(ti.fromBufferAttribute(s,e),a?ni.addScaledVector(ti,r):ni.addScaledVector(ti.sub(t),r))}t.add(ni)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Xr.copy(n.boundingSphere),Xr.applyMatrix4(i),Yr.copy(e.ray).recast(e.near),!(Xr.containsPoint(Yr.origin)===!1&&(Yr.intersectSphere(Xr,Zr)===null||Yr.origin.distanceToSquared(Zr)>(e.far-e.near)**2))&&(Jr.copy(i).invert(),Yr.copy(e.ray).applyMatrix4(Jr),(n.boundingBox===null||Yr.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Yr)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=oi(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=oi(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=oi(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=oi(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function ai(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;ii.copy(s),ii.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(ii);return l<n.near||l>n.far?null:{distance:l,point:ii.clone(),object:e}}function oi(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Qr),e.getVertexPosition(c,$r),e.getVertexPosition(l,ei);let u=ai(e,t,n,r,Qr,$r,ei,ri);if(u){let e=new W;tr.getBarycoord(ri,Qr,$r,ei,e),i&&(u.uv=tr.getInterpolatedAttribute(i,s,c,l,e,new U)),a&&(u.uv1=tr.getInterpolatedAttribute(a,s,c,l,e,new U)),o&&(u.normal=tr.getInterpolatedAttribute(o,s,c,l,e,new W),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new W,materialIndex:0};tr.getNormal(Qr,$r,ei,t.normal),u.face=t,u.barycoord=e}return u}var si=class extends Zt{constructor(e=null,t=1,n=1,r,i,a,o,s,c=u,l=u,d,f){super(null,a,o,s,c,l,r,i,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},ci=class extends br{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},li=new rn,ui=new rn,di=[],fi=new nr,pi=new rn,mi=new q,hi=new Dr,gi=class extends q{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ci(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,pi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new nr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,li),fi.copy(e.boundingBox).applyMatrix4(li),this.boundingBox.union(fi)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Dr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,li),hi.copy(e.boundingSphere).applyMatrix4(li),this.boundingSphere.union(hi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(mi.geometry=this.geometry,mi.material=this.material,mi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),hi.copy(this.boundingSphere),hi.applyMatrix4(n),e.ray.intersectsSphere(hi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,li),ui.multiplyMatrices(n,li),mi.matrixWorld=ui,mi.raycast(e,di);for(let e=0,n=di.length;e<n;e++){let n=di[e];n.instanceId=i,n.object=this,t.push(n)}di.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ci(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new si(new Float32Array(r*this.count),r,this.count,P,S));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},_i=new Dr,vi=new U(.5,.5),yi=new W,bi=class{constructor(e=new zr,t=new zr,n=new zr,r=new zr,i=new zr,a=new zr){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Xe,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),_i.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),_i.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(_i)}intersectsSprite(e){return _i.center.set(0,0,0),_i.radius=.7071067811865476+vi.distanceTo(e.center),_i.applyMatrix4(e.matrixWorld),this.intersectsSphere(_i)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(yi.x=r.normal.x>0?e.max.x:e.min.x,yi.y=r.normal.y>0?e.max.y:e.min.y,yi.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(yi)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},xi=class extends Zt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Si=class extends Zt{constructor(e,t,n=x,r,i,a,o=u,s=u,c,l=M,d=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new qt(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Ci=class extends Si{constructor(e,t=x,n=301,r,i,a=u,o=u,s,c=M){let l={width:e,height:e,depth:1},d=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},wi=class extends Zt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Ti=class e extends Fr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Cr(c,3)),this.setAttribute(`normal`,new Cr(l,3)),this.setAttribute(`uv`,new Cr(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new W;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Ei=class e extends Fr{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new W,l=new U;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new Cr(a,3)),this.setAttribute(`normal`,new Cr(o,3)),this.setAttribute(`uv`,new Cr(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Di=class e extends Fr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Cr(u,3)),this.setAttribute(`normal`,new Cr(d,3)),this.setAttribute(`uv`,new Cr(f,2));function _(){let a=new W,_=new W,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new U,m=new W,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Oi=class e extends Di{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ki=class e extends Fr{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new Cr(i,3)),this.setAttribute(`normal`,new Cr(i.slice(),3)),this.setAttribute(`uv`,new Cr(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new W,r=new W,i=new W;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new W;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new W;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new W,t=new W,n=new W,r=new W,o=new U,s=new U,c=new U;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},Ai=class e extends ki{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=1/n,i=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-n,0,-r,n,0,r,-n,0,r,n,-r,-n,0,-r,n,0,r,-n,0,r,n,0,-n,0,-r,n,0,-r,-n,0,r,n,0,r];super(i,[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type=`DodecahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},ji=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){B(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new U:new W);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new W,r=[],i=[],a=[],o=new W,s=new rn;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new W)}i[0]=new W,a[0]=new W;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(H(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(H(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}};function Mi(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Ni=new W,Pi=new W,Fi=new Mi,Ii=new Mi,Li=new Mi,Ri=class extends ji{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new W){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(Pi.subVectors(r[0],r[1]).add(r[0]),c=Pi);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Ni.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Ni),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),Fi.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Ii.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),Li.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(Fi.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Ii.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),Li.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(Fi.calc(s),Ii.calc(s),Li.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new W().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}},zi=class e extends Fr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Cr(p,3)),this.setAttribute(`normal`,new Cr(m,3)),this.setAttribute(`uv`,new Cr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Bi=class e extends Fr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new W,d=new W,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Cr(p,3)),this.setAttribute(`normal`,new Cr(m,3)),this.setAttribute(`uv`,new Cr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Vi=class e extends Fr{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new W,f=new W,p=new W;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new Cr(c,3)),this.setAttribute(`normal`,new Cr(l,3)),this.setAttribute(`uv`,new Cr(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function Hi(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Wi(i))i.isRenderTargetTexture?(B(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(Wi(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Ui(e){let t={};for(let n=0;n<e.length;n++){let r=Hi(e[n]);for(let e in r)t[e]=r[e]}return t}function Wi(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Gi(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Ki(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Vt.workingColorSpace}var qi={clone:Hi,merge:Ui},Ji=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Yi=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Xi=class extends Vr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ji,this.fragmentShader=Yi,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Hi(e.uniforms),this.uniformsGroups=Gi(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new K().setHex(r.value);break;case`v2`:this.uniforms[n].value=new U().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new W().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Qt().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new G().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new rn().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Zi=class extends Xi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Qi=class extends Vr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new K(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new K(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new U(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},$i=class extends Qi{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new U(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return H(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new K(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new K(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new K(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},ea=class extends Vr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=He,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ta=class extends Vr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function na(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function ra(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var ia=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},aa=class extends ia{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ze,endingEnd:ze}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Be:i=e,o=2*t-n;break;case Ve:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Be:a=e,s=2*n-t;break;case Ve:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},oa=class extends ia{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},sa=class extends ia{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},ca=class extends ia{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=da(n,t,g,y,r);i[p]=la(x,o,_,b,m)}return i}};function la(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function ua(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function da(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=la(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=ua(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var fa=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=na(t,this.TimeBufferType),this.values=na(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:na(e.times,Array),values:na(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),ra(e.settings)&&(n.settings={inTangents:na(e.settings.inTangents,Array),outTangents:na(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new sa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new oa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new aa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new ca(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case z:t=this.InterpolantFactoryMethodDiscrete;break;case Ie:t=this.InterpolantFactoryMethodLinear;break;case Le:t=this.InterpolantFactoryMethodSmooth;break;case Re:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return B(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return z;case this.InterpolantFactoryMethodLinear:return Ie;case this.InterpolantFactoryMethodSmooth:return Le;case this.InterpolantFactoryMethodBezier:return Re}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;ra(this.settings)&&(pa(this.settings.inTangents,e),pa(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(V(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(V(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){V(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){V(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Qe(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){V(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Le,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,ra(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function pa(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}fa.prototype.ValueTypeName=``,fa.prototype.TimeBufferType=Float32Array,fa.prototype.ValueBufferType=Float32Array,fa.prototype.DefaultInterpolation=Ie;var ma=class extends fa{constructor(e,t,n){super(e,t,n)}};ma.prototype.ValueTypeName=`bool`,ma.prototype.ValueBufferType=Array,ma.prototype.DefaultInterpolation=z,ma.prototype.InterpolantFactoryMethodLinear=void 0,ma.prototype.InterpolantFactoryMethodSmooth=void 0;var ha=class extends fa{constructor(e,t,n,r){super(e,t,n,r)}};ha.prototype.ValueTypeName=`color`;var ga=class extends fa{constructor(e,t,n,r){super(e,t,n,r)}};ga.prototype.ValueTypeName=`number`;var _a=class extends ia{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Pt.slerpFlat(i,0,a,c-o,a,c,s);return i}},va=class extends fa{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new _a(this.times,this.values,this.getValueSize(),e)}};va.prototype.ValueTypeName=`quaternion`,va.prototype.InterpolantFactoryMethodSmooth=void 0;var ya=class extends fa{constructor(e,t,n){super(e,t,n)}};ya.prototype.ValueTypeName=`string`,ya.prototype.ValueBufferType=Array,ya.prototype.DefaultInterpolation=z,ya.prototype.InterpolantFactoryMethodLinear=void 0,ya.prototype.InterpolantFactoryMethodSmooth=void 0;var ba=class extends fa{constructor(e,t,n,r){super(e,t,n,r)}};ba.prototype.ValueTypeName=`vector`;var xa={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(Sa(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!Sa(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function Sa(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var Ca=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},wa=class{constructor(e){this.manager=e===void 0?Ca:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};wa.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var Ta=new WeakMap,Ea=class extends wa{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=xa.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=Ta.get(a);e===void 0&&(e=[],Ta.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=$e(`img`);function s(){l(),t&&t(this);let n=Ta.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}Ta.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),xa.remove(`image:${e}`);let n=Ta.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}Ta.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),xa.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},Da=class extends wa{constructor(e){super(e)}load(e,t,n,r){let i=new Zt,a=new Ea(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},Oa=class extends jn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new K(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},ka=class extends Oa{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(jn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new K(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Aa=new rn,ja=new W,Ma=new W,Na=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new U(512,512),this.mapType=g,this.map=null,this.mapPass=null,this.matrix=new rn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new bi,this._frameExtents=new U(1,1),this._viewportCount=1,this._viewports=[new Qt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;ja.setFromMatrixPosition(e.matrixWorld),t.position.copy(ja),Ma.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ma),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Aa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Aa,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Aa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Pa=new W,Fa=new Pt,Ia=new W,La=class extends jn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new rn,this.projectionMatrix=new rn,this.projectionMatrixInverse=new rn,this.coordinateSystem=Xe,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Pa,Fa,Ia),Ia.x===1&&Ia.y===1&&Ia.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Pa,Fa,Ia.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Pa,Fa,Ia),Ia.x===1&&Ia.y===1&&Ia.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Pa,Fa,Ia.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ra=new W,za=new U,Ba=new U,Va=class extends La{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=dt*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ut*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return dt*2*Math.atan(Math.tan(ut*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ra.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ra.x,Ra.y).multiplyScalar(-e/Ra.z),Ra.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ra.x,Ra.y).multiplyScalar(-e/Ra.z)}getViewSize(e,t){return this.getViewBounds(e,za,Ba),t.subVectors(Ba,za)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ut*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ha=class extends Na{constructor(){super(new Va(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=dt*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,i=e.distance||t.far;(n!==t.fov||r!==t.aspect||i!==t.far)&&(t.fov=n,t.aspect=r,t.far=i,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Ua=class extends Oa{constructor(e,t,n=0,r=Math.PI/3,i=0,a=2){super(e,t),this.isSpotLight=!0,this.type=`SpotLight`,this.position.copy(jn.DEFAULT_UP),this.updateMatrix(),this.target=new jn,this.distance=n,this.angle=r,this.penumbra=i,this.decay=a,this.map=null,this.shadow=new Ha}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Wa=class extends La{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Ga=class extends Na{constructor(){super(new Wa(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ka=class extends Oa{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(jn.DEFAULT_UP),this.updateMatrix(),this.target=new jn,this.shadow=new Ga}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},qa=-90,Ja=1,Ya=class extends jn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Va(qa,Ja,e,t);r.layers=this.layers,this.add(r);let i=new Va(qa,Ja,e,t);i.layers=this.layers,this.add(i);let a=new Va(qa,Ja,e,t);a.layers=this.layers,this.add(a);let o=new Va(qa,Ja,e,t);o.layers=this.layers,this.add(o);let s=new Va(qa,Ja,e,t);s.layers=this.layers,this.add(s);let c=new Va(qa,Ja,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Xa=class extends Va{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Za=`\\[\\]\\.:\\/`,Qa=RegExp(`[\\[\\]\\.:\\/]`,`g`),$a=`[^\\[\\]\\.:\\/]`,eo=`[^`+Za.replace(`\\.`,``)+`]`,to=`((?:WC+[\\/:])*)`.replace(`WC`,$a),no=`(WCOD+)?`.replace(`WCOD`,eo),ro=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,$a),io=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,$a),ao=RegExp(`^`+to+no+ro+io+`$`),oo=[`material`,`materials`,`bones`,`map`],so=class{constructor(e,t,n){let r=n||co.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},co=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Qa,``)}static parseTrackName(e){let t=ao.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);oo.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){B(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){V(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){V(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){V(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){V(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){V(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){V(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){V(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;V(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){V(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){V(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};co.Composite=so,co.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},co.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},co.prototype.GetterByBindingType=[co.prototype._getValue_direct,co.prototype._getValue_array,co.prototype._getValue_arrayElement,co.prototype._getValue_toArray],co.prototype.SetterByBindingTypeAndVersioning=[[co.prototype._setValue_direct,co.prototype._setValue_direct_setNeedsUpdate,co.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[co.prototype._setValue_array,co.prototype._setValue_array_setNeedsUpdate,co.prototype._setValue_array_setMatrixWorldNeedsUpdate],[co.prototype._setValue_arrayElement,co.prototype._setValue_arrayElement_setNeedsUpdate,co.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[co.prototype._setValue_fromArray,co.prototype._setValue_fromArray_setNeedsUpdate,co.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var lo=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,B(`Clock: This module has been deprecated. Please use THREE.Timer instead.`)}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};(class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});function uo(e,t,n,r){let i=fo(r);switch(n){case k:return e*t;case P:return e*t/i.components*i.byteLength;case ee:return e*t/i.components*i.byteLength;case F:return e*t*2/i.components*i.byteLength;case te:return e*t*2/i.components*i.byteLength;case A:return e*t*3/i.components*i.byteLength;case j:return e*t*4/i.components*i.byteLength;case ne:return e*t*4/i.components*i.byteLength;case re:case ie:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ae:case oe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case I:case le:return Math.max(e,16)*Math.max(t,8)/4;case se:case ce:return Math.max(e,8)*Math.max(t,8)/2;case ue:case de:case pe:case me:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case fe:case he:case ge:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case _e:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ve:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case ye:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case be:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case xe:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Se:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Ce:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case we:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Te:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Ee:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case De:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Oe:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case ke:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Ae:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case je:case L:case Me:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Ne:case Pe:return Math.ceil(e/4)*Math.ceil(t/4)*8;case R:case Fe:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function fo(e){switch(e){case g:case _:return{byteLength:1,components:1};case y:case v:case C:return{byteLength:2,components:1};case w:case T:return{byteLength:2,components:4};case x:case b:case S:return{byteLength:4,components:1};case D:case O:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?B(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function po(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function mo(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var J={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Y={common:{diffuse:{value:new K(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new G},alphaMap:{value:null},alphaMapTransform:{value:new G},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new G}},envmap:{envMap:{value:null},envMapRotation:{value:new G},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new G}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new G}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new G},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new G},normalScale:{value:new U(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new G},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new G}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new G}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new G}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new K(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new W},probesMax:{value:new W},probesResolution:{value:new W}},points:{diffuse:{value:new K(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new G},alphaTest:{value:0},uvTransform:{value:new G}},sprite:{diffuse:{value:new K(16777215)},opacity:{value:1},center:{value:new U(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new G},alphaMap:{value:null},alphaMapTransform:{value:new G},alphaTest:{value:0}}},ho={basic:{uniforms:Ui([Y.common,Y.specularmap,Y.envmap,Y.aomap,Y.lightmap,Y.fog]),vertexShader:J.meshbasic_vert,fragmentShader:J.meshbasic_frag},lambert:{uniforms:Ui([Y.common,Y.specularmap,Y.envmap,Y.aomap,Y.lightmap,Y.emissivemap,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.fog,Y.lights,{emissive:{value:new K(0)},envMapIntensity:{value:1}}]),vertexShader:J.meshlambert_vert,fragmentShader:J.meshlambert_frag},phong:{uniforms:Ui([Y.common,Y.specularmap,Y.envmap,Y.aomap,Y.lightmap,Y.emissivemap,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.fog,Y.lights,{emissive:{value:new K(0)},specular:{value:new K(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:J.meshphong_vert,fragmentShader:J.meshphong_frag},standard:{uniforms:Ui([Y.common,Y.envmap,Y.aomap,Y.lightmap,Y.emissivemap,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.roughnessmap,Y.metalnessmap,Y.fog,Y.lights,{emissive:{value:new K(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:J.meshphysical_vert,fragmentShader:J.meshphysical_frag},toon:{uniforms:Ui([Y.common,Y.aomap,Y.lightmap,Y.emissivemap,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.gradientmap,Y.fog,Y.lights,{emissive:{value:new K(0)}}]),vertexShader:J.meshtoon_vert,fragmentShader:J.meshtoon_frag},matcap:{uniforms:Ui([Y.common,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.fog,{matcap:{value:null}}]),vertexShader:J.meshmatcap_vert,fragmentShader:J.meshmatcap_frag},points:{uniforms:Ui([Y.points,Y.fog]),vertexShader:J.points_vert,fragmentShader:J.points_frag},dashed:{uniforms:Ui([Y.common,Y.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:J.linedashed_vert,fragmentShader:J.linedashed_frag},depth:{uniforms:Ui([Y.common,Y.displacementmap]),vertexShader:J.depth_vert,fragmentShader:J.depth_frag},normal:{uniforms:Ui([Y.common,Y.bumpmap,Y.normalmap,Y.displacementmap,{opacity:{value:1}}]),vertexShader:J.meshnormal_vert,fragmentShader:J.meshnormal_frag},sprite:{uniforms:Ui([Y.sprite,Y.fog]),vertexShader:J.sprite_vert,fragmentShader:J.sprite_frag},background:{uniforms:{uvTransform:{value:new G},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:J.background_vert,fragmentShader:J.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new G}},vertexShader:J.backgroundCube_vert,fragmentShader:J.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:J.cube_vert,fragmentShader:J.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:J.equirect_vert,fragmentShader:J.equirect_frag},distance:{uniforms:Ui([Y.common,Y.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:J.distance_vert,fragmentShader:J.distance_frag},shadow:{uniforms:Ui([Y.lights,Y.fog,{color:{value:new K(0)},opacity:{value:1}}]),vertexShader:J.shadow_vert,fragmentShader:J.shadow_frag}};ho.physical={uniforms:Ui([ho.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new G},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new G},clearcoatNormalScale:{value:new U(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new G},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new G},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new G},sheen:{value:0},sheenColor:{value:new K(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new G},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new G},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new G},transmissionSamplerSize:{value:new U},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new G},attenuationDistance:{value:0},attenuationColor:{value:new K(0)},specularColor:{value:new K(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new G},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new G},anisotropyVector:{value:new U},anisotropyMap:{value:null},anisotropyMapTransform:{value:new G}}]),vertexShader:J.meshphysical_vert,fragmentShader:J.meshphysical_frag};var go={r:0,b:0,g:0},_o=new rn,vo=new G;vo.set(-1,0,0,0,1,0,0,0,1);function yo(e,t,n,r,i,a){let o=new K(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new q(new Ti(1,1,1),new Xi({name:`BackgroundCubeMaterial`,uniforms:Hi(ho.backgroundCube.uniforms),vertexShader:ho.backgroundCube.vertexShader,fragmentShader:ho.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(_o.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(vo),l.material.toneMapped=Vt.getTransfer(i.colorSpace)!==Ke,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new q(new zi(2,2),new Xi({name:`BackgroundMaterial`,uniforms:Hi(ho.background.uniforms),vertexShader:ho.background.vertexShader,fragmentShader:ho.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Vt.getTransfer(i.colorSpace)!==Ke,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(go,Ki(e)),n.buffers.color.setClear(go.r,go.g,go.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function bo(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function xo(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function So(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(B(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&B(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Co(e){let t=this,n=null,r=0,i=!1,a=!1,o=new zr,s=new G,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var wo=4,To=6,Eo=20,Do=256,Oo=new Wa,ko=new K,Ao=null,jo=0,Mo=0,No=!1,Po=new W,Fo=new W,Io=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Po}=i;Ao=this._renderer.getRenderTarget(),jo=this._renderer.getActiveCubeFace(),Mo=this._renderer.getActiveMipmapLevel(),No=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Uo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ho(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Ao,jo,Mo),this._renderer.xr.enabled=No,e.scissorTest=!1,zo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ao=this._renderer.getRenderTarget(),jo=this._renderer.getActiveCubeFace(),Mo=this._renderer.getActiveMipmapLevel(),No=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:p,minFilter:p,generateMipmaps:!1,type:C,format:j,colorSpace:We,depthBuffer:!1},r=Ro(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ro(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Lo(r)),this._blurMaterial=Vo(r,e,t),this._ggxMaterial=Bo(r,e,t)}return r}_compileMaterial(e){let t=new q(new Fr,e);this._renderer.compile(t,Oo)}_sceneToCubeUV(e,t,n,r,i){let a=new Va(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(ko),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new q(new Ti,new qr({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(ko),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;zo(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Uo()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ho());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;zo(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Oo)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-wo?n-d+wo:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,zo(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Oo),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,zo(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Oo)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];zo(t,3*l*(r>this._lodMax-wo?r-this._lodMax+wo:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Oo)}};function Lo(e){let t=[],n=[],r=e,i=e-wo+1+To;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?Fo.set(1,r,n):e===1?Fo.set(-n,1,-r):e===2?Fo.set(-n,r,1):e===3?Fo.set(-1,r,-n):e===4?Fo.set(-n,-1,r):Fo.set(n,r,-1),Fo.toArray(l,(e*6+t)*3)}}let u=new Fr;u.setAttribute(`position`,new br(c,3)),u.setAttribute(`outputDirection`,new br(l,3)),n.push(new q(u,null)),r>wo&&r--}return{lodMeshes:n,sizeLods:t}}function Ro(e,t,n){let r=new en(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function zo(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Bo(e,t,n){return new Xi({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Do,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Wo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Vo(e,t,n){return new Xi({name:`SphericalGaussianBlur`,defines:{SAMPLES:Eo,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Wo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ho(){return new Xi({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Wo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Uo(){return new Xi({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Wo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Wo(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Go=class extends en{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new xi(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Ti(5,5,5),i=new Xi({name:`CubemapFromEquirect`,uniforms:Hi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new q(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=p),new Ya(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Ko(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Go(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Io(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Io(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function qo(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&it(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Jo(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?Sr:xr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Yo(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Xo(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:V(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Zo(e,t,n){let r=new WeakMap,i=new Qt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new tn(h,p,m,u);g.type=S,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new U(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Qo(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var $o={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function es(e,t,n,r,i,a){let o=new en(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Fr;l.setAttribute(`position`,new Cr([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new Cr([0,2,0,0,2,0],2));let u=new Zi({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new q(l,u),f=new Wa(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new en(t,n,{type:C,depthBuffer:!1,stencilBuffer:!1}),c=new en(t,n,{type:C,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},Vt.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=$o[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var ts=new Zt,ns=new Si(1,1),rs=new tn,is=new nn,as=new xi,os=[],ss=[],cs=new Float32Array(16),ls=new Float32Array(9),us=new Float32Array(4);function ds(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=os[i];if(a===void 0&&(a=new Float32Array(i),os[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function fs(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function ps(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function ms(e,t){let n=ss[t];n===void 0&&(n=new Int32Array(t),ss[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function hs(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function gs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(fs(n,t))return;e.uniform2fv(this.addr,t),ps(n,t)}}function _s(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(fs(n,t))return;e.uniform3fv(this.addr,t),ps(n,t)}}function vs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(fs(n,t))return;e.uniform4fv(this.addr,t),ps(n,t)}}function ys(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(fs(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),ps(n,t)}else{if(fs(n,r))return;us.set(r),e.uniformMatrix2fv(this.addr,!1,us),ps(n,r)}}function bs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(fs(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),ps(n,t)}else{if(fs(n,r))return;ls.set(r),e.uniformMatrix3fv(this.addr,!1,ls),ps(n,r)}}function xs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(fs(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),ps(n,t)}else{if(fs(n,r))return;cs.set(r),e.uniformMatrix4fv(this.addr,!1,cs),ps(n,r)}}function Ss(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Cs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(fs(n,t))return;e.uniform2iv(this.addr,t),ps(n,t)}}function ws(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(fs(n,t))return;e.uniform3iv(this.addr,t),ps(n,t)}}function Ts(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(fs(n,t))return;e.uniform4iv(this.addr,t),ps(n,t)}}function Es(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Ds(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(fs(n,t))return;e.uniform2uiv(this.addr,t),ps(n,t)}}function Os(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(fs(n,t))return;e.uniform3uiv(this.addr,t),ps(n,t)}}function ks(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(fs(n,t))return;e.uniform4uiv(this.addr,t),ps(n,t)}}function As(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(ns.compareFunction=n.isReversedDepthBuffer()?518:515,a=ns):a=ts,n.setTexture2D(t||a,i)}function js(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||is,i)}function Ms(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||as,i)}function Ns(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||rs,i)}function Ps(e){switch(e){case 5126:return hs;case 35664:return gs;case 35665:return _s;case 35666:return vs;case 35674:return ys;case 35675:return bs;case 35676:return xs;case 5124:case 35670:return Ss;case 35667:case 35671:return Cs;case 35668:case 35672:return ws;case 35669:case 35673:return Ts;case 5125:return Es;case 36294:return Ds;case 36295:return Os;case 36296:return ks;case 35678:case 36198:case 36298:case 36306:case 35682:return As;case 35679:case 36299:case 36307:return js;case 35680:case 36300:case 36308:case 36293:return Ms;case 36289:case 36303:case 36311:case 36292:return Ns}}function Fs(e,t){e.uniform1fv(this.addr,t)}function Is(e,t){let n=ds(t,this.size,2);e.uniform2fv(this.addr,n)}function Ls(e,t){let n=ds(t,this.size,3);e.uniform3fv(this.addr,n)}function Rs(e,t){let n=ds(t,this.size,4);e.uniform4fv(this.addr,n)}function zs(e,t){let n=ds(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Bs(e,t){let n=ds(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Vs(e,t){let n=ds(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Hs(e,t){e.uniform1iv(this.addr,t)}function Us(e,t){e.uniform2iv(this.addr,t)}function Ws(e,t){e.uniform3iv(this.addr,t)}function Gs(e,t){e.uniform4iv(this.addr,t)}function Ks(e,t){e.uniform1uiv(this.addr,t)}function qs(e,t){e.uniform2uiv(this.addr,t)}function Js(e,t){e.uniform3uiv(this.addr,t)}function Ys(e,t){e.uniform4uiv(this.addr,t)}function Xs(e,t,n){let r=this.cache,i=t.length,a=ms(n,i);fs(r,a)||(e.uniform1iv(this.addr,a),ps(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?ns:ts;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Zs(e,t,n){let r=this.cache,i=t.length,a=ms(n,i);fs(r,a)||(e.uniform1iv(this.addr,a),ps(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||is,a[e])}function Qs(e,t,n){let r=this.cache,i=t.length,a=ms(n,i);fs(r,a)||(e.uniform1iv(this.addr,a),ps(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||as,a[e])}function $s(e,t,n){let r=this.cache,i=t.length,a=ms(n,i);fs(r,a)||(e.uniform1iv(this.addr,a),ps(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||rs,a[e])}function ec(e){switch(e){case 5126:return Fs;case 35664:return Is;case 35665:return Ls;case 35666:return Rs;case 35674:return zs;case 35675:return Bs;case 35676:return Vs;case 5124:case 35670:return Hs;case 35667:case 35671:return Us;case 35668:case 35672:return Ws;case 35669:case 35673:return Gs;case 5125:return Ks;case 36294:return qs;case 36295:return Js;case 36296:return Ys;case 35678:case 36198:case 36298:case 36306:case 35682:return Xs;case 35679:case 36299:case 36307:return Zs;case 35680:case 36300:case 36308:case 36293:return Qs;case 36289:case 36303:case 36311:case 36292:return $s}}var tc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ps(t.type)}},nc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ec(t.type)}},rc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},ic=/(\w+)(\])?(\[|\.)?/g;function ac(e,t){e.seq.push(t),e.map[t.id]=t}function oc(e,t,n){let r=e.name,i=r.length;for(ic.lastIndex=0;;){let a=ic.exec(r),o=ic.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){ac(n,l===void 0?new tc(s,e,t):new nc(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new rc(s),ac(n,e)),n=e}}}var sc=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);oc(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function cc(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var lc=37297,uc=0;function dc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var fc=new G;function pc(e){Vt._getMatrix(fc,Vt.workingColorSpace,e);let t=`mat3( ${fc.elements.map(e=>e.toFixed(4))} )`;switch(Vt.getTransfer(e)){case Ge:return[t,`LinearTransferOETF`];case Ke:return[t,`sRGBTransferOETF`];default:return B(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function mc(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+dc(e.getShaderSource(t),r)}return i}function hc(e,t){let n=pc(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var gc={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function _c(e,t){let n=gc[t];return n===void 0?(B(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var vc=new W;function yc(){return Vt.getLuminanceCoefficients(vc),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${vc.x.toFixed(4)}, ${vc.y.toFixed(4)}, ${vc.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function bc(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Cc).join(`
`)}function xc(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Sc(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Cc(e){return e!==``}function wc(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Tc(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Ec=/^[ \t]*#include +<([\w\d./]+)>/gm;function Dc(e){return e.replace(Ec,kc)}var Oc=new Map;function kc(e,t){let n=J[t];if(n===void 0){let e=Oc.get(t);if(e!==void 0)n=J[e],B(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Dc(n)}var Ac=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function jc(e){return e.replace(Ac,Mc)}function Mc(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Nc(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Pc={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Fc(e){return Pc[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Ic={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Lc(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Ic[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Rc={302:`ENVMAP_MODE_REFRACTION`};function zc(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Rc[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Bc={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Vc(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Bc[e.combine]||`ENVMAP_BLENDING_NONE`}function Hc(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Uc(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Fc(n),l=Lc(n),u=zc(n),d=Vc(n),f=Hc(n),p=bc(n),m=xc(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Cc).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Cc).join(`
`),_.length>0&&(_+=`
`)):(g=[Nc(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Cc).join(`
`),_=[Nc(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:J.tonemapping_pars_fragment,n.toneMapping===0?``:_c(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,J.colorspace_pars_fragment,hc(`linearToOutputTexel`,n.outputColorSpace),yc(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Cc).join(`
`)),o=Dc(o),o=wc(o,n),o=Tc(o,n),s=Dc(s),s=wc(s,n),s=Tc(s,n),o=jc(o),s=jc(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=cc(i,i.VERTEX_SHADER,y),S=cc(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=mc(i,x,`vertex`),n=mc(i,S,`fragment`);V(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):B(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new sc(i,h),T=Sc(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,lc)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=uc++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Wc=0,Gc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Kc(e),t.set(e,n)),n}},Kc=class{constructor(e){this.id=Wc++,this.code=e,this.usedTimes=0}};function qc(e){return e===1030||e===37490||e===36285}function Jc(e,t,n,r,i,a){let o=new hn,s=new Gc,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&B(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=ho[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),M=e.state.buffers.depth.getReversed(),N=h.isInstancedMesh===!0,P=h.isBatchedMesh===!0,ee=!!i.map,F=!!i.matcap,te=!!x,ne=!!i.aoMap,re=!!i.lightMap,ie=!!i.bumpMap&&i.wireframe===!1,ae=!!i.normalMap,oe=!!i.displacementMap,se=!!i.emissiveMap,I=!!i.metalnessMap,ce=!!i.roughnessMap,le=i.anisotropy>0,ue=i.clearcoat>0,de=i.dispersion>0,fe=i.retroreflectivity>0,pe=i.iridescence>0,me=i.sheen>0,he=i.transmission>0,ge=le&&!!i.anisotropyMap,_e=ue&&!!i.clearcoatMap,ve=ue&&!!i.clearcoatNormalMap,ye=ue&&!!i.clearcoatRoughnessMap,be=pe&&!!i.iridescenceMap,xe=pe&&!!i.iridescenceThicknessMap,Se=me&&!!i.sheenColorMap,Ce=me&&!!i.sheenRoughnessMap,we=!!i.specularMap,Te=!!i.specularColorMap,Ee=!!i.specularIntensityMap,De=he&&!!i.transmissionMap,Oe=he&&!!i.thicknessMap,ke=!!i.gradientMap,Ae=!!i.alphaMap,je=i.alphaTest>0,L=!!i.alphaHash,Me=!!i.extensions,Ne=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Ne=e.toneMapping);let Pe={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:P,batchingColor:P&&h._colorsTexture!==null,instancing:N,instancingColor:N&&h.instanceColor!==null,instancingMorph:N&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Vt.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ee,matcap:F,envMap:te,envMapMode:te&&x.mapping,envMapCubeUVHeight:S,aoMap:ne,lightMap:re,bumpMap:ie,normalMap:ae,displacementMap:oe,emissiveMap:se,normalMapObjectSpace:ae&&i.normalMapType===1,normalMapTangentSpace:ae&&i.normalMapType===0,packedNormalMap:ae&&i.normalMapType===0&&qc(i.normalMap.format),metalnessMap:I,roughnessMap:ce,anisotropy:le,anisotropyMap:ge,clearcoat:ue,clearcoatMap:_e,clearcoatNormalMap:ve,clearcoatRoughnessMap:ye,dispersion:de,retroreflection:fe,iridescence:pe,iridescenceMap:be,iridescenceThicknessMap:xe,sheen:me,sheenColorMap:Se,sheenRoughnessMap:Ce,specularMap:we,specularColorMap:Te,specularIntensityMap:Ee,transmission:he,transmissionMap:De,thicknessMap:Oe,gradientMap:ke,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ae,alphaTest:je,alphaHash:L,combine:i.combine,mapUv:ee&&m(i.map.channel),aoMapUv:ne&&m(i.aoMap.channel),lightMapUv:re&&m(i.lightMap.channel),bumpMapUv:ie&&m(i.bumpMap.channel),normalMapUv:ae&&m(i.normalMap.channel),displacementMapUv:oe&&m(i.displacementMap.channel),emissiveMapUv:se&&m(i.emissiveMap.channel),metalnessMapUv:I&&m(i.metalnessMap.channel),roughnessMapUv:ce&&m(i.roughnessMap.channel),anisotropyMapUv:ge&&m(i.anisotropyMap.channel),clearcoatMapUv:_e&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:ve&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ye&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:xe&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:Se&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&m(i.sheenRoughnessMap.channel),specularMapUv:we&&m(i.specularMap.channel),specularColorMapUv:Te&&m(i.specularColorMap.channel),specularIntensityMapUv:Ee&&m(i.specularIntensityMap.channel),transmissionMapUv:De&&m(i.transmissionMap.channel),thicknessMapUv:Oe&&m(i.thicknessMap.channel),alphaMapUv:Ae&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(ae||le),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ee||Ae),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&ae===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:M,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ne,decodeVideoTexture:ee&&i.map.isVideoTexture===!0&&Vt.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:se&&i.emissiveMap.isVideoTexture===!0&&Vt.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Me&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Me&&i.extensions.multiDraw===!0||P)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Pe.vertexUv1s=c.has(1),Pe.vertexUv2s=c.has(2),Pe.vertexUv3s=c.has(3),c.clear(),Pe}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=ho[t];n=qi.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Uc(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Yc(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Xc(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Zc(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Qc(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||Xc),r.length>1&&r.sort(t||Zc),i.length>1&&i.sort(t||Zc)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function $c(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Qc,e.set(t,[i])):n>=r.length?(i=new Qc,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function el(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new W,color:new K};break;case`SpotLight`:n={position:new W,direction:new W,color:new K,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new W,color:new K,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new W,skyColor:new K,groundColor:new K};break;case`RectAreaLight`:n={color:new K,position:new W,halfWidth:new W,halfHeight:new W}}return e[t.id]=n,n}}}function tl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var nl=0;function rl(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function il(e){let t=new el,n=tl(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new W);let i=new W,a=new rn,o=new rn;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(rl);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Y.LTC_FLOAT_1,r.rectAreaLTC2=Y.LTC_FLOAT_2):(r.rectAreaLTC1=Y.LTC_HALF_1,r.rectAreaLTC2=Y.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=nl++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function al(e){let t=new il(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function ol(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new al(e),t.set(n,[a])):r>=i.length?(a=new al(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var sl=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,cl=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,ll=[new W(1,0,0),new W(-1,0,0),new W(0,1,0),new W(0,-1,0),new W(0,0,1),new W(0,0,-1)],ul=[new W(0,-1,0),new W(0,-1,0),new W(0,0,1),new W(0,0,-1),new W(0,-1,0),new W(0,-1,0)],dl=new rn,fl=new W,pl=new W;function ml(e,t,n){let r=new bi,i=new U,a=new U,o=new Qt,s=new ea,c=new ta,l={},d=n.maxTextureSize,f={0:1,1:0,2:2},m=new Xi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new U},radius:{value:4}},vertexShader:sl,fragmentShader:cl}),h=m.clone();h.defines.HORIZONTAL_PASS=1;let g=new Fr;g.setAttribute(`position`,new br(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new q(g,m),v=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let y=this.type;this.render=function(t,n,s){if(v.enabled===!1||v.autoUpdate===!1&&v.needsUpdate===!1||t.length===0)return;this.type===2&&(B(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.state;m.setBlending(0),m.buffers.depth.getReversed()===!0?m.buffers.color.setClear(0,0,0,0):m.buffers.color.setClear(1,1,1,1),m.buffers.depth.setTest(!0),m.setScissorTest(!1);let h=y!==this.type;h&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],f=l.shadow;if(f===void 0){B(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(f.autoUpdate===!1&&f.needsUpdate===!1)continue;i.copy(f.mapSize);let g=f.getFrameExtents();i.multiply(g),a.copy(f.mapSize),(i.x>d||i.y>d)&&(i.x>d&&(a.x=Math.floor(d/g.x),i.x=a.x*g.x,f.mapSize.x=a.x),i.y>d&&(a.y=Math.floor(d/g.y),i.y=a.y*g.y,f.mapSize.y=a.y));let _=e.state.buffers.depth.getReversed();if(f.camera._reversedDepth=_,f.map===null||h===!0){if(f.map!==null&&(f.map.depthTexture!==null&&(f.map.depthTexture.dispose(),f.map.depthTexture=null),f.map.dispose()),this.type===3){if(l.isPointLight){B(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}f.map=new en(i.x,i.y,{format:F,type:C,minFilter:p,magFilter:p,generateMipmaps:!1}),f.map.texture.name=l.name+`.shadowMap`,f.map.depthTexture=new Si(i.x,i.y,S),f.map.depthTexture.name=l.name+`.shadowMapDepth`,f.map.depthTexture.format=M,f.map.depthTexture.compareFunction=null,f.map.depthTexture.minFilter=u,f.map.depthTexture.magFilter=u}else l.isPointLight?(f.map=new Go(i.x),f.map.depthTexture=new Ci(i.x,x)):(f.map=new en(i.x,i.y),f.map.depthTexture=new Si(i.x,i.y,x)),f.map.depthTexture.name=l.name+`.shadowMap`,f.map.depthTexture.format=M,this.type===1?(f.map.depthTexture.compareFunction=_?518:515,f.map.depthTexture.minFilter=p,f.map.depthTexture.magFilter=p):(f.map.depthTexture.compareFunction=null,f.map.depthTexture.minFilter=u,f.map.depthTexture.magFilter=u);f.camera.updateProjectionMatrix()}f.map.isWebGLCubeRenderTarget!==!0&&(f.map.width!==i.x||f.map.height!==i.y)&&f.map.setSize(i.x,i.y);let v=f.map.isWebGLCubeRenderTarget?6:f.getViewportCount();l.isPointLight!==!0&&f.updateMatrices(l,s);for(let t=0;t<v;t++){let i=f.getCamera(t);if(l.isPointLight){let e=f.camera,n=f.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),fl.setFromMatrixPosition(l.matrixWorld),e.position.copy(fl),pl.copy(e.position),pl.add(ll[t]),e.up.copy(ul[t]),e.lookAt(pl),e.updateMatrixWorld(),n.makeTranslation(-fl.x,-fl.y,-fl.z),dl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),f._frustum.setFromProjectionMatrix(dl,e.coordinateSystem,e.reversedDepth)}if(f.map.isWebGLCubeRenderTarget)e.setRenderTarget(f.map,t),e.clear();else{t===0&&(e.setRenderTarget(f.map),e.clear());let n=f.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),m.viewport(o)}r=f.getFrustum(t),T(n,s,i,l,this.type)}f.isPointLightShadow!==!0&&this.type===3&&b(f,s),f.needsUpdate=!1}y=this.type,v.needsUpdate=!1,e.setRenderTarget(c,l,f)};function b(n,r){let a=t.update(_);m.defines.VSM_SAMPLES!==n.blurSamples&&(m.defines.VSM_SAMPLES=n.blurSamples,h.defines.VSM_SAMPLES=n.blurSamples,m.needsUpdate=!0,h.needsUpdate=!0),n.mapPass===null?n.mapPass=new en(i.x,i.y,{format:F,type:C}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),m.uniforms.shadow_pass.value=n.map.depthTexture,m.uniforms.resolution.value.set(n.map.width,n.map.height),m.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,m,_,null),h.uniforms.shadow_pass.value=n.mapPass.texture,h.uniforms.resolution.value.set(n.map.width,n.map.height),h.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,h,_,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,E)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?f[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function T(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=w(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)T(c[e],i,a,o,s)}function E(e){e.target.removeEventListener(`dispose`,E);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function hl(e,t){function n(){let t=!1,n=new Qt,r=null,i=new Qt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?I(e.DEPTH_TEST):ce(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=ot[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?I(e.STENCIL_TEST):ce(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new K(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,P=0,ee=e.getParameter(e.VERSION);ee.indexOf(`WebGL`)===-1?ee.indexOf(`OpenGL ES`)!==-1&&(P=parseFloat(/^OpenGL ES (\d)/.exec(ee)[1]),N=P>=2):(P=parseFloat(/^WebGL (\d)/.exec(ee)[1]),N=P>=1);let F=null,te={},ne=e.getParameter(e.SCISSOR_BOX),re=e.getParameter(e.VIEWPORT),ie=new Qt().fromArray(ne),ae=new Qt().fromArray(re);function oe(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let se={};se[e.TEXTURE_2D]=oe(e.TEXTURE_2D,e.TEXTURE_2D,1),se[e.TEXTURE_CUBE_MAP]=oe(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[e.TEXTURE_2D_ARRAY]=oe(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),se[e.TEXTURE_3D]=oe(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),I(e.DEPTH_TEST),o.setFunc(3),ge(!1),_e(1),I(e.CULL_FACE),me(0);function I(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ce(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function le(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ue(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function de(t){return h!==t&&(e.useProgram(t),h=t,!0)}let fe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};fe[103]=e.MIN,fe[104]=e.MAX;let pe={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function me(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(ce(e.BLEND),g=!1);else if(g===!1&&(I(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:V(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:V(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:V(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:V(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(fe[n],fe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(pe[r],pe[i],pe[o],pe[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function he(t,n){t.side===2?ce(e.CULL_FACE):I(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ge(r),t.blending===1&&t.transparent===!1?me(0):me(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ye(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?I(e.SAMPLE_ALPHA_TO_COVERAGE):ce(e.SAMPLE_ALPHA_TO_COVERAGE)}function ge(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function _e(t){t===0?ce(e.CULL_FACE):(I(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ve(t){t!==k&&(N&&e.lineWidth(t),k=t)}function ye(t,n,r){t?(I(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):ce(e.POLYGON_OFFSET_FILL)}function be(t){t?I(e.SCISSOR_TEST):ce(e.SCISSOR_TEST)}function xe(t){t===void 0&&(t=e.TEXTURE0+M-1),F!==t&&(e.activeTexture(t),F=t)}function Se(t,n,r){r===void 0&&(r=F===null?e.TEXTURE0+M-1:F);let i=te[r];i===void 0&&(i={type:void 0,texture:void 0},te[r]=i),(i.type!==t||i.texture!==n)&&(F!==r&&(e.activeTexture(r),F=r),e.bindTexture(t,n||se[t]),i.type=t,i.texture=n)}function Ce(){let t=te[F];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function we(){try{e.compressedTexImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Te(){try{e.compressedTexImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Ee(){try{e.texSubImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function De(){try{e.texSubImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Oe(){try{e.compressedTexSubImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function ke(){try{e.compressedTexSubImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Ae(){try{e.texStorage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function je(){try{e.texStorage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function L(){try{e.texImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Me(){try{e.texImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Ne(t){return d[t]===void 0?e.getParameter(t):d[t]}function Pe(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function R(t){ie.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ie.copy(t))}function Fe(t){ae.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ae.copy(t))}function z(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Ie(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Le(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},F=null,te={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new K(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ie.set(0,0,e.canvas.width,e.canvas.height),ae.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:I,disable:ce,bindFramebuffer:le,drawBuffers:ue,useProgram:de,setBlending:me,setMaterial:he,setFlipSided:ge,setCullFace:_e,setLineWidth:ve,setPolygonOffset:ye,setScissorTest:be,activeTexture:xe,bindTexture:Se,unbindTexture:Ce,compressedTexImage2D:we,compressedTexImage3D:Te,texImage2D:L,texImage3D:Me,pixelStorei:Pe,getParameter:Ne,updateUBOMapping:z,uniformBlockBinding:Ie,texStorage2D:Ae,texStorage3D:je,texSubImage2D:Ee,texSubImage3D:De,compressedTexSubImage2D:Oe,compressedTexSubImage3D:ke,scissor:R,viewport:Fe,reset:Le}}function gl(e,t,n,r,i,a,o){let g=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new U,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):$e(`canvas`)}function T(e,t,n){let r=1,i=Ne(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),B(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&B(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function E(e){return e.generateMipmaps}function D(t){e.generateMipmap(t)}function O(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function k(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];B(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||B(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Ge:Vt.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function A(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,B(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function j(e,t){return E(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function M(e){let t=e.target;t.removeEventListener(`dispose`,M),ee(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function P(e){let t=e.target;t.removeEventListener(`dispose`,P),te(t)}function ee(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=S.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&F(e),Object.keys(i).length===0&&S.delete(n)}r.remove(e)}function F(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=S.get(i);delete a[n.__cacheKey],o.memory.textures--}function te(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let ne=0;function re(){ne=0}function ie(){return ne}function ae(e){ne=e}function oe(){let e=ne;return e>=i.maxTextures&&B(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),ne+=1,e}function se(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function I(t,i){let a=r.get(t);if(t.isVideoTexture&&L(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)B(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)B(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ve(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function ce(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ve(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function le(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ve(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ue(t,i){let a=r.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version?ye(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let de={[s]:e.REPEAT,[c]:e.CLAMP_TO_EDGE,[l]:e.MIRRORED_REPEAT},fe={[u]:e.NEAREST,[d]:e.NEAREST_MIPMAP_NEAREST,[f]:e.NEAREST_MIPMAP_LINEAR,[p]:e.LINEAR,[m]:e.LINEAR_MIPMAP_NEAREST,[h]:e.LINEAR_MIPMAP_LINEAR},pe={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function me(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&B(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,de[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,de[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,de[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,fe[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,fe[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,pe[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function he(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,M));let i=n.source,a=S.get(i);a===void 0&&(a={},S.set(i,a));let s=se(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&F(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function ge(e,t,n){return Math.floor(Math.floor(e/n)/t)}function _e(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=ge(n.start,r.width,4),c=ge(t.start,r.width,4);n.start<=i+1&&a===c&&ge(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function ve(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=he(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let d=r.get(u);if(u.version!==d.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Vt.getPrimaries(Vt.workingColorSpace),r=o.colorSpace===``?null:Vt.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=T(o.image,!1,i.maxTextureSize);t=Me(o,t);let r=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=k(o.internalFormat,r,f,o.normalized,o.colorSpace,o.isVideoTexture);me(c,o);let m,h=o.mipmaps,g=o.isVideoTexture!==!0,_=d.__version===void 0||l===!0,v=u.dataReady,y=j(o,t);if(o.isDepthTexture)p=A(o.format===N,o.type),_&&(g?n.texStorage2D(e.TEXTURE_2D,1,p,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,p,t.width,t.height,0,r,f,null));else if(o.isDataTexture){if(h.length>0){g&&_&&n.texStorage2D(e.TEXTURE_2D,y,p,h[0].width,h[0].height);for(let t=0,i=h.length;t<i;t++)m=h[t],g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,m.width,m.height,r,f,m.data):n.texImage2D(e.TEXTURE_2D,t,p,m.width,m.height,0,r,f,m.data);o.generateMipmaps=!1}else g?(_&&n.texStorage2D(e.TEXTURE_2D,y,p,t.width,t.height),v&&_e(o,t,r,f)):n.texImage2D(e.TEXTURE_2D,0,p,t.width,t.height,0,r,f,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){g&&_&&n.texStorage3D(e.TEXTURE_2D_ARRAY,y,p,h[0].width,h[0].height,t.depth);for(let i=0,a=h.length;i<a;i++)if(m=h[i],o.format!==1023){if(r!==null){if(g){if(v){if(o.layerUpdates.size>0){let t=uo(m.width,m.height,o.format,o.type);for(let a of o.layerUpdates){let o=m.data.subarray(a*t/m.data.BYTES_PER_ELEMENT,(a+1)*t/m.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,m.width,m.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,m.width,m.height,t.depth,r,m.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,p,m.width,m.height,t.depth,0,m.data,0,0)}else B(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?v&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,m.width,m.height,t.depth,r,f,m.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,p,m.width,m.height,t.depth,0,r,f,m.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{g&&_&&n.texStorage2D(e.TEXTURE_2D,y,p,h[0].width,h[0].height);for(let t=0,i=h.length;t<i;t++)m=h[t],o.format===1023?g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,m.width,m.height,r,f,m.data):n.texImage2D(e.TEXTURE_2D,t,p,m.width,m.height,0,r,f,m.data):r===null?B(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,m.width,m.height,r,m.data):n.compressedTexImage2D(e.TEXTURE_2D,t,p,m.width,m.height,0,m.data)}}else if(o.isDataArrayTexture){if(g){if(_&&n.texStorage3D(e.TEXTURE_2D_ARRAY,y,p,t.width,t.height,t.depth),v){if(o.layerUpdates.size>0){let i=uo(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,f,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,f,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,p,t.width,t.height,t.depth,0,r,f,t.data)}else if(o.isData3DTexture)g?(_&&n.texStorage3D(e.TEXTURE_3D,y,p,t.width,t.height,t.depth),v&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,f,t.data)):n.texImage3D(e.TEXTURE_3D,0,p,t.width,t.height,t.depth,0,r,f,t.data);else if(o.isFramebufferTexture){if(_){if(g)n.texStorage2D(e.TEXTURE_2D,y,p,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<y;t++)n.texImage2D(e.TEXTURE_2D,t,p,i,a,0,r,f,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),b.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let t=Ne(h[0]);n.texStorage2D(e.TEXTURE_2D,y,p,t.width,t.height)}for(let t=0,i=h.length;t<i;t++)m=h[t],g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,f,m):n.texImage2D(e.TEXTURE_2D,t,p,r,f,m);o.generateMipmaps=!1}else if(g){if(_){let r=Ne(t);n.texStorage2D(e.TEXTURE_2D,y,p,r.width,r.height)}v&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,f,t)}else n.texImage2D(e.TEXTURE_2D,0,p,r,f,t);E(o)&&D(c),d.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ye(t,o,s){if(o.image.length!==6)return;let c=he(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Vt.getPrimaries(Vt.workingColorSpace),r=o.colorSpace===``?null:Vt.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=T(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Me(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),v=k(o.internalFormat,g,_,o.normalized,o.colorSpace),y=o.isVideoTexture!==!0,b=u.__version===void 0||c===!0,x=l.dataReady,S=j(o,h);me(e.TEXTURE_CUBE_MAP,o);let C;if(f){y&&b&&n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let t=0;t<6;t++){C=m[t].mipmaps;for(let r=0;r<C.length;r++){let i=C[r];o.format===1023?y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,g,_,i.data):g===null?B(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,i.data)}}}else{if(C=o.mipmaps,y&&b){C.length>0&&S++;let t=Ne(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,t.width,t.height)}for(let t=0;t<6;t++)if(p){y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<C.length;r++){let i=C[r].image[t].image;y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,i.width,i.height,0,g,_,i.data)}}else{y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,m[t]);for(let r=0;r<C.length;r++){let i=C[r];y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,g,_,i.image[t])}}}E(o)&&D(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function be(t,i,o,s,c,l){let u=a.convert(o.format,o.colorSpace),d=a.convert(o.type),f=k(o.internalFormat,u,d,o.normalized,o.colorSpace),p=r.get(i),m=r.get(o);if(m.__renderTarget=i,!p.__hasExternalTextures){let t=Math.max(1,i.width>>l),r=Math.max(1,i.height>>l);c===e.TEXTURE_3D||c===e.TEXTURE_2D_ARRAY?n.texImage3D(c,l,f,t,r,i.depth,0,u,d,null):n.texImage2D(c,l,f,t,r,0,u,d,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),je(i)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,s,c,m.__webglTexture,0,Ae(i)):(c===e.TEXTURE_2D||c>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&c<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,s,c,m.__webglTexture,l),n.bindFramebuffer(e.FRAMEBUFFER,null)}function xe(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=A(n.stencilBuffer,a),s=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;je(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ae(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ae(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,s,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],s=a.convert(o.format,o.colorSpace),c=a.convert(o.type),l=k(o.internalFormat,s,c,o.normalized,o.colorSpace);je(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ae(n),l,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ae(n),l,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,l,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Se(t,i,o){let s=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let c=r.get(i.depthTexture);if(c.__renderTarget=i,(!c.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),s){if(c.__webglInit===void 0&&(c.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,M)),c.__webglTexture===void 0){c.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),me(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else I(i.depthTexture,0);let l=c.__webglTexture,u=Ae(i),d=s?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,f=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)je(i)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,f,d,l,0,u):e.framebufferTexture2D(e.FRAMEBUFFER,f,d,l,0);else if(i.depthTexture.format===1027)je(i)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,f,d,l,0,u):e.framebufferTexture2D(e.FRAMEBUFFER,f,d,l,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Ce(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)Se(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?Se(i.__webglFramebuffer[0],t,0):Se(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),xe(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),xe(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function we(t,n,i){let a=r.get(t);n!==void 0&&be(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&Ce(t)}function Te(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,P);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&je(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=k(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Ae(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),xe(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),me(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)be(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else be(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);E(i)&&D(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),me(c,a),be(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),E(a)&&D(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),me(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)be(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else be(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);E(i)&&D(r),n.unbindTexture()}t.depthBuffer&&Ce(t)}function Ee(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(E(a)){let t=O(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),D(t),n.unbindTexture()}}}let De=[],Oe=[];function ke(t){if(t.samples>0){if(je(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,c=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,l=r.get(t),u=i.length>1;if(u)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,l.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,l.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,l.__webglMultisampledFramebuffer);let d=t.texture.mipmaps;d&&d.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,l.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,l.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),u){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,l.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),_===!0&&(De.length=0,Oe.length=0,De.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(De.push(c),Oe.push(c),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Oe)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,De))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),u)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,l.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,l.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,l.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,l.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&_){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Ae(e){return Math.min(i.maxSamples,e.samples)}function je(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function L(e){let t=o.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Me(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Vt.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&B(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):V(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ne(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=oe,this.resetTextureUnits=re,this.getTextureUnits=ie,this.setTextureUnits=ae,this.setTexture2D=I,this.setTexture2DArray=ce,this.setTexture3D=le,this.setTextureCube=ue,this.rebindTextures=we,this.setupRenderTarget=Te,this.updateRenderTargetMipmap=Ee,this.updateMultisampleRenderTarget=ke,this.setupDepthRenderbuffer=Ce,this.setupFrameBufferTexture=be,this.useMultisampledRTT=je,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function _l(e,t){function n(n,r=``){let i,a=Vt.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var vl=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,yl=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,bl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new wi(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Xi({vertexShader:vl,fragmentShader:yl,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new q(new zi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},xl=class extends st{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new bl,_={},v=t.getContextAttributes(),y=null,b=null,S=[],C=[],w=new U,T=null,D=null,O=new Va;O.viewport=new Qt;let k=new Va;k.viewport=new Qt;let A=[O,k],P=new Xa,ee=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=S[e];return t===void 0&&(t=new Pn,S[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=S[e];return t===void 0&&(t=new Pn,S[e]=t),t.getGripSpace()},this.getHand=function(e){let t=S[e];return t===void 0&&(t=new Pn,S[e]=t),t.getHandSpace()};function te(e){let t=C.indexOf(e.inputSource);if(t===-1)return;let n=S[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ne(){r.removeEventListener(`select`,te),r.removeEventListener(`selectstart`,te),r.removeEventListener(`selectend`,te),r.removeEventListener(`squeeze`,te),r.removeEventListener(`squeezestart`,te),r.removeEventListener(`squeezeend`,te),r.removeEventListener(`end`,ne),r.removeEventListener(`inputsourceschange`,re);for(let e=0;e<S.length;e++){let t=C[e];t!==null&&(C[e]=null,S[e].disconnect(t))}ee=null,F=null,h.reset();for(let e in _)delete _[e];if(e.setRenderTarget(y),f=null,d=null,u=null,r=null,b=null,ue.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(w.width,w.height,!1),D!==null){let e=D.camera;e.fov=D.fov,e.zoom=D.zoom,e.updateProjectionMatrix(),D=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&B(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&B(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(y=e.getRenderTarget(),r.addEventListener(`select`,te),r.addEventListener(`selectstart`,te),r.addEventListener(`selectend`,te),r.addEventListener(`squeeze`,te),r.addEventListener(`squeezestart`,te),r.addEventListener(`squeezeend`,te),r.addEventListener(`end`,ne),r.addEventListener(`inputsourceschange`,re),v.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(w),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;v.depth&&(o=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=v.stencil?N:M,a=v.stencil?E:x);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),b=new en(d.textureWidth,d.textureHeight,{format:j,type:g,depthTexture:new Si(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new en(f.framebufferWidth,f.framebufferHeight,{format:j,type:g,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),ue.setContext(r),ue.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function re(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=C.indexOf(n);r>=0&&(C[r]=null,S[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=C.indexOf(n);if(r===-1){for(let e=0;e<S.length;e++)if(e>=C.length){C.push(n),r=e;break}else if(C[e]===null){C[e]=n,r=e;break}if(r===-1)break}let i=S[r];i&&i.connect(n)}}let ie=new W,ae=new W;function oe(e,t,n){ie.setFromMatrixPosition(t.matrixWorld),ae.setFromMatrixPosition(n.matrixWorld);let r=ie.distanceTo(ae),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function se(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),P.near=k.near=O.near=t,P.far=k.far=O.far=n,(ee!==P.near||F!==P.far)&&(r.updateRenderState({depthNear:P.near,depthFar:P.far}),ee=P.near,F=P.far),P.layers.mask=e.layers.mask|6,O.layers.mask=P.layers.mask&-5,k.layers.mask=P.layers.mask&-3;let i=e.parent,a=P.cameras;se(P,i);for(let e=0;e<a.length;e++)se(a[e],i);a.length===2?oe(P,O,k):P.projectionMatrix.copy(O.projectionMatrix),D===null&&e.isPerspectiveCamera&&(D={camera:e,fov:e.fov,zoom:e.zoom}),I(e,P,i)};function I(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=dt*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(P)},this.getCameraTexture=function(e){return _[e]};let ce=null;function le(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(b,f.framebuffer),e.setRenderTarget(b));let i=!1;t.length!==P.cameras.length&&(P.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(b,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(b))}let o=A[n];o===void 0&&(o=new Va,o.layers.enable(n),o.viewport=new Qt,A[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(P.matrix.copy(o.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),i===!0&&P.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=_[n];e||(e=new wi,_[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<S.length;e++){let t=C[e],n=S[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ce&&ce(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let ue=new po;ue.setAnimationLoop(le),this.setAnimationLoop=function(e){ce=e},this.dispose=function(){}}},Sl=new rn,Cl=new G;Cl.set(-1,0,0,0,1,0,0,0,1);function wl(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Ki(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Sl.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Cl),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Tl(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return V(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?B(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):B(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var El=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Dl=null;function Ol(){return Dl===null&&(Dl=new si(El,16,16,F,C),Dl.name=`DFG_LUT`,Dl.minFilter=p,Dl.magFilter=p,Dl.wrapS=c,Dl.wrapT=c,Dl.generateMipmaps=!1,Dl.needsUpdate=!0),Dl}var kl=class{constructor(e={}){let{canvas:t=et(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=g}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,_=new Set([ne,te,ee]),v=new Set([g,x,y,E,w,T]),b=new Uint32Array(4),S=new Int32Array(4),D=new W,O=null,k=null,A=[],j=[],M=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let N=this,P=!1,F=null,re=null,ie=null,ae=null;this._outputColorSpace=Ue;let oe=0,se=0,I=null,ce=-1,le=null,ue=new Qt,de=new Qt,fe=null,pe=new K(0),me=0,he=t.width,ge=t.height,_e=1,ve=null,ye=null,be=new Qt(0,0,he,ge),xe=new Qt(0,0,he,ge),Se=!1,Ce=new bi,we=!1,Te=!1,Ee=new rn,De=new W,Oe=new Qt,ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ae=!1;function je(){return I===null?_e:1}let L=n;function Me(e,n){return t.getContext(e,n)}let Ne,Pe,R,Fe,z,Ie,Le,Re,ze,Be,Ve,He,We,Ge,Ke,qe,Je,Ye,Ze,Qe,$e,tt,rt;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,st,!1),t.addEventListener(`webglcontextrestored`,ct,!1),t.addEventListener(`webglcontextcreationerror`,lt,!1),L===null){let t=`webgl2`;if(L=Me(t,e),L===null)throw Me(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}it()}catch(e){throw t.removeEventListener(`webglcontextlost`,st,!1),t.removeEventListener(`webglcontextrestored`,ct,!1),t.removeEventListener(`webglcontextcreationerror`,lt,!1),V(`WebGLRenderer: `+e.message),e}function it(){Ne=new qo(L),Ne.init(),$e=new _l(L,Ne),Pe=new So(L,Ne,e,$e),R=new hl(L,Ne),Pe.reversedDepthBuffer&&d&&R.buffers.depth.setReversed(!0),re=L.createFramebuffer(),ie=L.createFramebuffer(),ae=L.createFramebuffer(),Fe=new Xo(L),z=new Yc,Ie=new gl(L,Ne,R,z,Pe,$e,Fe),Le=new Ko(N),Re=new mo(L),tt=new bo(L,Re),ze=new Jo(L,Re,Fe,tt),Be=new Qo(L,ze,Re,tt,Fe),Ye=new Zo(L,Pe,Ie),Ke=new Co(z),Ve=new Jc(N,Le,Ne,Pe,tt,Ke),He=new wl(N,z),We=new $c,Ge=new ol(Ne),Je=new yo(N,Le,R,Be,p,s),qe=new ml(N,Be,Pe),rt=new Tl(L,Fe,Pe,R),Ze=new xo(L,Ne,Fe),Qe=new Yo(L,Ne,Fe),Fe.programs=Ve.programs,N.capabilities=Pe,N.extensions=Ne,N.properties=z,N.renderLists=We,N.shadowMap=qe,N.state=R,N.info=Fe}m!==1009&&(M=new es(m,t.width,t.height,o,r,i));let ot=new xl(N,L);this.xr=ot,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let e=Ne.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Ne.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return _e},this.setPixelRatio=function(e){e!==void 0&&(_e=e,this.setSize(he,ge,!1))},this.getSize=function(e){return e.set(he,ge)},this.setSize=function(e,n,r=!0){ot.isPresenting?B(`WebGLRenderer: Can't change size while VR device is presenting.`):(he=e,ge=n,t.width=Math.floor(e*_e),t.height=Math.floor(n*_e),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),M!==null&&M.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(he*_e,ge*_e).floor()},this.setDrawingBufferSize=function(e,n,r){he=e,ge=n,_e=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)V(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){B(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}M.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(ue)},this.getViewport=function(e){return e.copy(be)},this.setViewport=function(e,t,n,r){e.isVector4?be.set(e.x,e.y,e.z,e.w):be.set(e,t,n,r),R.viewport(ue.copy(be).multiplyScalar(_e).round())},this.getScissor=function(e){return e.copy(xe)},this.setScissor=function(e,t,n,r){e.isVector4?xe.set(e.x,e.y,e.z,e.w):xe.set(e,t,n,r),R.scissor(de.copy(xe).multiplyScalar(_e).round())},this.getScissorTest=function(){return Se},this.setScissorTest=function(e){R.setScissorTest(Se=e)},this.setOpaqueSort=function(e){ve=e},this.setTransparentSort=function(e){ye=e},this.getClearColor=function(e){return e.copy(Je.getClearColor())},this.setClearColor=function(){Je.setClearColor(...arguments)},this.getClearAlpha=function(){return Je.getClearAlpha()},this.setClearAlpha=function(){Je.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(I!==null){let t=I.texture.format;e=_.has(t)}if(e){let e=I.texture.type,t=v.has(e),n=Je.getClearColor(),r=Je.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(b[0]=i,b[1]=a,b[2]=o,b[3]=r,L.clearBufferuiv(L.COLOR,0,b)):(S[0]=i,S[1]=a,S[2]=o,S[3]=r,L.clearBufferiv(L.COLOR,0,S))}else r|=L.COLOR_BUFFER_BIT}t&&(r|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&L.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),F=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,st,!1),t.removeEventListener(`webglcontextrestored`,ct,!1),t.removeEventListener(`webglcontextcreationerror`,lt,!1),Je.dispose(),We.dispose(),Ge.dispose(),z.dispose(),Le.dispose(),Be.dispose(),tt.dispose(),rt.dispose(),Ve.dispose(),ot.dispose(),ot.removeEventListener(`sessionstart`,ht),ot.removeEventListener(`sessionend`,gt),_t.stop()};function st(e){e.preventDefault(),nt(`WebGLRenderer: Context Lost.`),P=!0}function ct(){nt(`WebGLRenderer: Context Restored.`),P=!1;let e=Fe.autoReset,t=qe.enabled,n=qe.autoUpdate,r=qe.needsUpdate,i=qe.type;it(),Fe.autoReset=e,qe.enabled=t,qe.autoUpdate=n,qe.needsUpdate=r,qe.type=i}function lt(e){V(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function ut(e){let t=e.target;t.removeEventListener(`dispose`,ut),dt(t)}function dt(e){ft(e),z.remove(e)}function ft(e){let t=z.get(e).programs;t!==void 0&&(t.forEach(function(e){Ve.releaseProgram(e)}),e.isShaderMaterial&&Ve.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ke);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Dt(e,t,n,r,i);R.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=ze.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;tt.setup(i,r,s,n,c);let h,g=Ze;if(c!==null&&(h=Re.get(c),g=Qe,g.setIndex(h)),i.isMesh)r.wireframe===!0?(R.setLineWidth(r.wireframeLinewidth*je()),g.setMode(L.LINES)):g.setMode(L.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),R.setLineWidth(e*je()),i.isLineSegments?g.setMode(L.LINES):i.isLineLoop?g.setMode(L.LINE_LOOP):g.setMode(L.LINE_STRIP)}else i.isPoints?g.setMode(L.POINTS):i.isSprite&&g.setMode(L.TRIANGLES);if(i.isBatchedMesh){if(Ne.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Re.get(c).bytesPerElement:1,o=z.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(L,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function H(e,t,n,r){F!==null&&e.isNodeMaterial&&F.setObject(r,e),we===!0&&Ke.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,Ct(e,t,r),e.side=0,e.needsUpdate=!0,Ct(e,t,r),e.side=2):Ct(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),F!==null&&F.renderStart(e,t,n),k=Ge.get(n),k.init(t),j.push(k),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),k.setupLights(),F!==null&&F.updateLights(k.state.lightsArray),Te=this.localClippingEnabled,we=Ke.init(this.clippingPlanes,Te),we===!0&&Ke.setGlobalState(this.clippingPlanes,t),F!==null&&qe.render(k.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];H(o,n,t,e),r.add(o)}else H(i,n,t,e),r.add(i)}}),k=j.pop(),F!==null&&F.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=z.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Ne.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let pt=null;function mt(e){pt&&pt(e)}function ht(){_t.stop()}function gt(){_t.start()}let _t=new po;_t.setAnimationLoop(mt),typeof self<`u`&&_t.setContext(self),this.setAnimationLoop=function(e){pt=e,ot.setAnimationLoop(e),e===null?_t.stop():_t.start()},ot.addEventListener(`sessionstart`,ht),ot.addEventListener(`sessionend`,gt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){V(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(P===!0)return;F!==null&&F.renderStart(e,t);let n=ot.enabled===!0&&ot.isPresenting===!0,r=M!==null&&(I===null||n)&&M.begin(N,I);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),ot.enabled===!0&&ot.isPresenting===!0&&(M===null||M.isCompositing()===!1)&&(ot.cameraAutoUpdate===!0&&ot.updateCamera(t),t=ot.getCamera()),e.isScene===!0&&e.onBeforeRender(N,e,t,I),k=Ge.get(e,j.length),k.init(t),k.state.textureUnits=Ie.getTextureUnits(),j.push(k),Ee.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Ce.setFromProjectionMatrix(Ee,Xe,t.reversedDepth),Te=this.localClippingEnabled,we=Ke.init(this.clippingPlanes,Te),O=We.get(e,A.length),O.init(),A.push(O),ot.enabled===!0&&ot.isPresenting===!0){let e=N.xr.getDepthSensingMesh();e!==null&&vt(e,t,-1/0,N.sortObjects)}vt(e,t,0,N.sortObjects),O.finish(),F!==null&&F.updateLights(k.state.lightsArray),N.sortObjects===!0&&O.sort(ve,ye),Ae=ot.enabled===!1||ot.isPresenting===!1||ot.hasDepthSensing()===!1,Ae&&Je.addToRenderList(O,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),we===!0&&Ke.beginShadows();let i=k.state.shadowsArray;if(qe.render(i,e,t),we===!0&&Ke.endShadows(),(r&&M.hasRenderPass())===!1){let n=O.opaque,r=O.transmissive;if(k.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];bt(n,r,e,a)}Ae&&Je.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];yt(O,e,n,n.viewport)}}else r.length>0&&bt(n,r,e,t),Ae&&Je.render(e),yt(O,e,t)}I!==null&&se===0&&(Ie.updateMultisampleRenderTarget(I),Ie.updateRenderTargetMipmap(I)),r&&M.end(N),e.isScene===!0&&e.onAfterRender(N,e,t),tt.resetDefaultState(),ce=-1,le=null,j.pop(),j.length>0?(k=j[j.length-1],Ie.setTextureUnits(k.state.textureUnits),we===!0&&Ke.setGlobalState(N.clippingPlanes,k.state.camera)):k=null,A.pop(),O=A.length>0?A[A.length-1]:null,F!==null&&F.renderEnd()};function vt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)k.pushLightProbeGrid(e);else if(e.isLight)k.pushLight(e),e.castShadow&&k.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(Ce)){r&&Oe.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Ee);let i=Be.update(e),a=e.material;a.visible&&O.push(e,i,a,n,Oe.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(Ce))){let i=Be.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),Oe.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Oe.copy(e.boundingSphere.center)),Oe.applyMatrix4(e.matrixWorld).applyMatrix4(Ee)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&O.push(e,i,c,n,Oe.z,s,t)}}else a.visible&&O.push(e,i,a,n,Oe.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)vt(i[e],t,n,r)}function yt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;k.setupLightsView(n),we===!0&&Ke.setGlobalState(N.clippingPlanes,n),r&&R.viewport(ue.copy(r)),i.length>0&&xt(i,t,n),a.length>0&&xt(a,t,n),o.length>0&&xt(o,t,n),R.buffers.depth.setTest(!0),R.buffers.depth.setMask(!0),R.buffers.color.setMask(!0),R.setPolygonOffset(!1)}function bt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(k.state.transmissionRenderTarget[r.id]===void 0){let e=Ne.has(`EXT_color_buffer_half_float`)||Ne.has(`EXT_color_buffer_float`);k.state.transmissionRenderTarget[r.id]=new en(1,1,{generateMipmaps:!0,type:e?C:g,minFilter:h,samples:Math.max(4,Pe.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Vt.workingColorSpace})}let a=k.state.transmissionRenderTarget[r.id],o=r.viewport||ue;a.setSize(o.z*N.transmissionResolutionScale,o.w*N.transmissionResolutionScale);let s=N.getRenderTarget(),c=N.getActiveCubeFace(),l=N.getActiveMipmapLevel();N.setRenderTarget(a),N.getClearColor(pe),me=N.getClearAlpha(),me<1&&N.setClearColor(16777215,.5),N.clear(),Ae&&Je.render(n);let u=N.toneMapping;N.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),k.setupLightsView(r),we===!0&&Ke.setGlobalState(N.clippingPlanes,r),xt(e,n,r),Ie.updateMultisampleRenderTarget(a),Ie.updateRenderTargetMipmap(a),Ne.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,St(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(Ie.updateMultisampleRenderTarget(a),Ie.updateRenderTargetMipmap(a))}N.setRenderTarget(s,c,l),N.setClearColor(pe,me),d!==void 0&&(r.viewport=d),N.toneMapping=u}function xt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&St(o,t,n,s,l,c)}}function St(e,t,n,r,i,a){F!==null&&i.isNodeMaterial&&F.setObject(e,i),e.onBeforeRender(N,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(N,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,N.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,N.renderBufferDirect(n,t,r,i,e,a),i.side=2):N.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(N,t,n,r,i,a)}function Ct(e,t,n){t.isScene!==!0&&(t=ke);let r=z.get(e),i=k.state.lights,a=k.state.shadowsArray,o=i.state.version,s=Ve.getParameters(e,i.state,a,t,n,k.state.lightProbeGridArray),c=Ve.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Le.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,ut),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Tt(e,s),d}else s.uniforms=Ve.getUniforms(e),F!==null&&e.isNodeMaterial&&F.build(e,n,s),e.onBeforeCompile(s,N),d=Ve.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ke.uniform),Tt(e,s),r.needsLights=kt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=k.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function wt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=sc.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Tt(e,t){let n=z.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Et(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];D.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(D))return n}return null}function Dt(e,t,n,r,i){t.isScene!==!0&&(t=ke),Ie.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=I===null?N.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Vt.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Le.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(h=N.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=z.get(r),y=k.state.lights;if(we===!0&&(Te===!0||e!==le)){let t=e===le&&r.id===ce;Ke.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ke.numPlanes||v.numIntersection!==Ke.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=k.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=Ct(r,t,i),F&&r.isNodeMaterial&&F.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(R.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==ce&&(ce=r.id,C=!0),v.needsLights){let e=Et(k.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||le!==e){R.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(L,`projectionMatrix`,e.projectionMatrix),T.setValue(L,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(L,De.setFromMatrixPosition(e.matrixWorld)),Pe.logarithmicDepthBuffer&&T.setValue(L,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(L,`isOrthographic`,e.isOrthographicCamera===!0),le!==e&&(le=e,C=!0,w=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&T.setValue(L,`sunShadowMap`,y.state.sunShadowMap,Ie),y.state.directionalShadowMap.length>0&&T.setValue(L,`directionalShadowMap`,y.state.directionalShadowMap,Ie),y.state.spotShadowMap.length>0&&T.setValue(L,`spotShadowMap`,y.state.spotShadowMap,Ie),y.state.pointShadowMap.length>0&&T.setValue(L,`pointShadowMap`,y.state.pointShadowMap,Ie)),i.isSkinnedMesh){T.setOptional(L,i,`bindMatrix`),T.setOptional(L,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(L,`boneTexture`,e.boneTexture,Ie))}i.isBatchedMesh&&(T.setOptional(L,i,`batchingTexture`),T.setValue(L,`batchingTexture`,i._matricesTexture,Ie),T.setOptional(L,i,`batchingIdTexture`),T.setValue(L,`batchingIdTexture`,i._indirectTexture,Ie),T.setOptional(L,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(L,`batchingColorTexture`,i._colorsTexture,Ie));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&Ye.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(L,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=Ol()),C){if(T.setValue(L,`toneMappingExposure`,N.toneMappingExposure),v.needsLights&&Ot(E,w),a&&r.fog===!0&&He.refreshFogUniforms(E,a),He.refreshMaterialUniforms(E,r,_e,ge,k.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}sc.upload(L,wt(v),E,Ie)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(sc.upload(L,wt(v),E,Ie),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(L,`center`,i.center),T.setValue(L,`modelViewMatrix`,i.modelViewMatrix),T.setValue(L,`normalMatrix`,i.normalMatrix),T.setValue(L,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];rt.update(n,x),rt.bind(n,x)}}return x}function Ot(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function kt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return oe},this.getActiveMipmapLevel=function(){return se},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(e,t,n){let r=z.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),z.get(e.texture).__webglTexture=t,z.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=z.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){I=e,oe=t,se=n;let r=null,i=!1,a=!1;if(e){let o=z.get(e);if(o.__useDefaultFramebuffer!==void 0){R.bindFramebuffer(L.FRAMEBUFFER,o.__webglFramebuffer),ue.copy(e.viewport),de.copy(e.scissor),fe=e.scissorTest,R.viewport(ue),R.scissor(de),R.setScissorTest(fe),ce=-1;return}if(o.__webglFramebuffer===void 0)Ie.setupRenderTarget(e);else if(o.__hasExternalTextures)Ie.rebindTextures(e,z.get(e.texture).__webglTexture,z.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&z.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);Ie.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=z.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&Ie.useMultisampledRTT(e)===!1?z.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,ue.copy(e.viewport),de.copy(e.scissor),fe=e.scissorTest}else ue.copy(be).multiplyScalar(_e).floor(),de.copy(xe).multiplyScalar(_e).floor(),fe=Se;if(n!==0&&(r=re),R.bindFramebuffer(L.FRAMEBUFFER,r)&&R.drawBuffers(e,r),R.viewport(ue),R.scissor(de),R.setScissorTest(fe),i){let r=z.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=z.get(e.textures[t]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=z.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,t.__webglTexture,n)}ce=-1};function At(e){let t=z.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Pe.textureFormatReadable(e.format),t.__typeReadable=Pe.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){V(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=z.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){R.bindFramebuffer(L.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s);let u=At(o);if(u.__formatReadable===!1){V(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){V(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&L.readPixels(t,n,r,i,$e.convert(c),$e.convert(l),a)}finally{let e=I===null?null:z.get(I).__webglFramebuffer;R.bindFramebuffer(L.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=z.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){R.bindFramebuffer(L.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s);let d=At(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,f),L.bufferData(L.PIXEL_PACK_BUFFER,a.byteLength,L.STREAM_READ),L.readPixels(t,n,r,i,$e.convert(l),$e.convert(u),0),L.bindBuffer(L.PIXEL_PACK_BUFFER,null);let p=I===null?null:z.get(I).__webglFramebuffer;R.bindFramebuffer(L.FRAMEBUFFER,p);let m=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await at(L,m,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,f),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,a),L.bindBuffer(L.PIXEL_PACK_BUFFER,null),L.deleteBuffer(f),L.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Ie.setTexture2D(e,0),L.copyTexSubImage2D(L.TEXTURE_2D,n,0,0,o,s,i,a),R.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=$e.convert(t.format),_=$e.convert(t.type),v;t.isData3DTexture?(Ie.setTexture3D(t,0),v=L.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Ie.setTexture2DArray(t,0),v=L.TEXTURE_2D_ARRAY):(Ie.setTexture2D(t,0),v=L.TEXTURE_2D),R.activeTexture(L.TEXTURE0),R.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,t.flipY),R.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),R.pixelStorei(L.UNPACK_ALIGNMENT,t.unpackAlignment);let y=R.getParameter(L.UNPACK_ROW_LENGTH),b=R.getParameter(L.UNPACK_IMAGE_HEIGHT),x=R.getParameter(L.UNPACK_SKIP_PIXELS),S=R.getParameter(L.UNPACK_SKIP_ROWS),C=R.getParameter(L.UNPACK_SKIP_IMAGES);R.pixelStorei(L.UNPACK_ROW_LENGTH,h.width),R.pixelStorei(L.UNPACK_IMAGE_HEIGHT,h.height),R.pixelStorei(L.UNPACK_SKIP_PIXELS,l),R.pixelStorei(L.UNPACK_SKIP_ROWS,u),R.pixelStorei(L.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=z.get(e),r=z.get(t),h=z.get(n.__renderTarget),g=z.get(r.__renderTarget);R.bindFramebuffer(L.READ_FRAMEBUFFER,h.__webglFramebuffer),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,z.get(e).__webglTexture,i,d+n),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,z.get(t).__webglTexture,a,m+n)),L.blitFramebuffer(l,u,o,s,f,p,o,s,L.DEPTH_BUFFER_BIT,L.NEAREST);R.bindFramebuffer(L.READ_FRAMEBUFFER,null),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||z.has(e)){let n=z.get(e),r=z.get(t);R.bindFramebuffer(L.READ_FRAMEBUFFER,ie),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,ae);for(let e=0;e<c;e++)w?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,n.__webglTexture,i),T?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,r.__webglTexture,a),i===0?T?L.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):L.copyTexSubImage2D(v,a,f,p,l,u,o,s):L.blitFramebuffer(l,u,o,s,f,p,o,s,L.COLOR_BUFFER_BIT,L.NEAREST);R.bindFramebuffer(L.READ_FRAMEBUFFER,null),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?L.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h);R.pixelStorei(L.UNPACK_ROW_LENGTH,y),R.pixelStorei(L.UNPACK_IMAGE_HEIGHT,b),R.pixelStorei(L.UNPACK_SKIP_PIXELS,x),R.pixelStorei(L.UNPACK_SKIP_ROWS,S),R.pixelStorei(L.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&L.generateMipmap(v),R.unbindTexture()},this.initRenderTarget=function(e){z.get(e).__webglFramebuffer===void 0&&Ie.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Ie.setTextureCube(e,0):e.isData3DTexture?Ie.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Ie.setTexture2DArray(e,0):Ie.setTexture2D(e,0),R.unbindTexture()},this.resetState=function(){oe=0,se=0,I=null,R.reset(),tt.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Xe}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Vt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Vt._getUnpackColorSpace()}},Al=class{constructor(e){this.scene=e,this.stageGroup=new Mn,this.stageGroup.name=`RallyStageRoot`,this.scene.add(this.stageGroup),this.roadCurve=null,this.totalDistance=0,this.sampleCache=[]}buildStage(e){this.clear();let t=e.waypoints||[];if(t.length<2){console.warn(`[StageMeshGenerator] Insufficient waypoints to build stage.`);return}let n=t.map(e=>new W(e.x,e.y,e.z));this.roadCurve=new Ri(n,!1,`catmullrom`,.5),this.totalDistance=e.totalLengthMeters||4200;let r=Math.max(120,t.length*25);this.sampleCache=[];for(let n=0;n<=r;n++){let i=n/r,a=this.roadCurve.getPointAt(i),o=this.roadCurve.getTangentAt(i).normalize(),s=new W(0,1,0),c=new W().crossVectors(o,s).normalize(),l=new W().crossVectors(c,o).normalize(),u=Math.min(t.length-1,Math.floor(i*(t.length-1))),d=t[u]?.camber||0,f=t[u]?.width||e.baseRoadWidthMeters||6;c.applyAxisAngle(o,d),l.applyAxisAngle(o,d),this.sampleCache.push({u:i,distance:i*this.totalDistance,point:a,tangent:o,binormal:c,trueUp:l,camber:d,width:f})}this._extrudeRoadMesh(e),this._extrudeRumbleStrips(),this._extrudeGuardrails(),this._generateCorridorTerrain(e),this._spawnTracksideProps(e)}_extrudeRoadMesh(e){let t=this.sampleCache,n=t.length-1,r=(n+1)*7,i=new Float32Array(r*3),a=new Float32Array(r*3),o=new Float32Array(r*2),s=[],c=0,l=0;for(let e=0;e<=n;e++){let r=t[e],u=r.width*.5;for(let e=0;e<7;e++){let t=e/6*2-1,n=t*u,s=Math.cos(Math.PI/2*t)*.12,d=r.point.x+r.binormal.x*n+r.trueUp.x*s,f=r.point.y+r.binormal.y*n+r.trueUp.y*s,p=r.point.z+r.binormal.z*n+r.trueUp.z*s;i[c*3]=d,i[c*3+1]=f,i[c*3+2]=p,a[c*3]=r.trueUp.x,a[c*3+1]=r.trueUp.y,a[c*3+2]=r.trueUp.z,o[l*2]=(t+1)*.5,o[l*2+1]=r.distance*.2,c++,l++}if(e<n)for(let t=0;t<6;t++){let n=e*7+t,r=(e+1)*7+t;s.push(n,r,n+1),s.push(n+1,r,r+1)}}let u=new Fr;u.setAttribute(`position`,new br(i,3)),u.setAttribute(`normal`,new br(a,3)),u.setAttribute(`uv`,new br(o,2)),u.setIndex(s),u.computeVertexNormals();let d=e.surface===`gravel`||e.surface===`rocky`,f=new q(u,new Qi({color:d?9268835:2829099,roughness:d?.95:.72,metalness:.08,flatShading:!1}));f.name=`RallyRoadRibbon`,f.receiveShadow=!0,this.stageGroup.add(f)}_extrudeRumbleStrips(){let e=this.sampleCache,t=new Qi({color:13378082,roughness:.6});for(let n=5;n<e.length-10;n+=6){let r=e[n];if(Math.abs(r.camber)>.03||n%18==0){let e=r.camber>0?1:-1,n=r.width*.5,i=new q(new Ti(.5,.15,3.2),t);i.position.set(r.point.x+r.binormal.x*(n+.25)*e,r.point.y+.08,r.point.z+r.binormal.z*(n+.25)*e),i.quaternion.setFromUnitVectors(new W(0,0,1),r.tangent),i.receiveShadow=!0,this.stageGroup.add(i)}}}_extrudeGuardrails(){let e=this.sampleCache,t=new Qi({color:11583173,metalness:.85,roughness:.35});for(let n=10;n<e.length-15;n+=4){let r=e[n],i=r.width*.5+.8,a=new q(new Di(.06,.06,.9,8),t);a.position.set(r.point.x+r.binormal.x*i,r.point.y+.45,r.point.z+r.binormal.z*i),a.castShadow=!0,this.stageGroup.add(a);let o=new q(new Ti(.12,.35,4.2),t);o.position.set(r.point.x+r.binormal.x*i,r.point.y+.55,r.point.z+r.binormal.z*i),o.quaternion.setFromUnitVectors(new W(0,0,1),r.tangent),o.castShadow=!0,this.stageGroup.add(o)}}_generateCorridorTerrain(e){this.sampleCache.length;let t=new zi(240,this.totalDistance*1.05,40,60);t.rotateX(-Math.PI/2);let n=t.attributes.position;for(let e=0;e<n.count;e++){let t=n.getX(e),r=n.getZ(e),i=Math.sin(t*.035)*Math.cos(r*.015)*25+Math.sin(t*.08+r*.05)*8,a=Math.min(1,Math.max(0,(Math.abs(t)-8)/40));n.setY(e,i*a-.4)}t.computeVertexNormals();let r=e.surface===`snow`,i=e.surface===`gravel`,a=new q(t,new Qi({color:r?15528177:i?3034151:5125166,roughness:.95,metalness:.05,flatShading:!0}));a.name=`RallyMountainTerrain`,a.position.set(0,-.2,this.totalDistance*.45),a.receiveShadow=!0,this.stageGroup.add(a)}_spawnTracksideProps(e){let t=this.sampleCache;this._createGantryGate(t[0],`START`),this._createGantryGate(t[t.length-1],`FINISH`);let n=new Qi({color:4073251,roughness:.9}),r=new Qi({color:1793568,roughness:.8}),i=new Di(.25,.4,4,6),a=new Oi(2.4,7.5,7);for(let e=4;e<t.length-4;e+=3){let o=t[e];for(let e of[-1,1])if(Math.random()<.65){let t=(o.width*.5+3.5+Math.random()*22)*e,s=new Mn,c=new q(i,n);c.position.y=2,c.castShadow=!0;let l=new q(a,r);l.position.y=6,l.castShadow=!0,s.add(c),s.add(l);let u=.8+Math.random()*.5;s.scale.set(u,u,u),s.position.set(o.point.x+o.binormal.x*t,o.point.y,o.point.z+o.binormal.z*t),this.stageGroup.add(s)}}}_createGantryGate(e,t){if(!e)return;let n=new Mn,r=new Qi({color:t===`START`?3046706:13840175,metalness:.7,roughness:.3}),i=new Di(.18,.18,6.5,8),a=new q(i,r);a.position.set(-e.width*.65,3.25,0);let o=new q(i,r);o.position.set(e.width*.65,3.25,0);let s=new q(new Ti(e.width*1.4,1.2,.25),r);s.position.set(0,5.8,0),n.add(a),n.add(o),n.add(s),n.position.copy(e.point),n.quaternion.setFromUnitVectors(new W(0,0,1),e.tangent),this.stageGroup.add(n)}getPointAtDistance(e){if(!this.roadCurve||this.sampleCache.length===0)return{x:0,y:.5,z:e,heading:0};let t=Math.max(0,Math.min(this.totalDistance,e))/this.totalDistance,n=this.roadCurve.getPointAt(t),r=this.roadCurve.getTangentAt(t).normalize(),i=Math.atan2(r.x,r.z)*(180/Math.PI);return{x:n.x,y:n.y,z:n.z,heading:i}}clear(){for(;this.stageGroup.children.length>0;){let e=this.stageGroup.children[0];this.stageGroup.remove(e),e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.dispose()):e.material.dispose())}}},jl=class{constructor(e){this.scene=e,this.carRoot=new Mn,this.carRoot.name=`RallyCarRoot`,this.scene.add(this.carRoot),this.wheelRadius=.33,this.wheelWidth=.24,this.bodyMesh=null,this.bodyMaterial=null,this.steeringWheel=null,this.brakeDiscs={},this.wheelMeshes={},this.suspensionArms={},this.aeroGroup=null,this.lightPodGroup=null,this.mudflapGroup=null,this.headlights=[],this.brakeLights=[],this.textureLoader=new Da,this.loadedTextures={},this._buildCarHierarchy(),this._setupEventListeners()}_buildCarHierarchy(){let e=i.currentTuning;this._buildBodyMesh(e),this._buildInterior(),this._buildWheels(e),this.updateAeroKit(e.visual_parts?.aeroKit||`wrc_spec_high_downforce`),this.updateLightPods(e.visual_parts?.lightPods||`quad_hella_hood`),this.updateMudflaps(e.visual_parts?.mudflaps||`rally_red`),this._buildLighting(),this.loadLiveryTexture(e.visual_parts?.liveryPreset||`wrc_red`)}_buildBodyMesh(e){let t=new Mn;t.name=`CarBodyGroup`;let n=e.visual_parts?.bodyColor||`#e10600`;this.bodyMaterial=new Qi({color:new K(n),metalness:.75,roughness:.32,clearcoat:.9,clearcoatRoughness:.1});let r=new Ti(1.85,.48,4.1,4,2,8),i=r.attributes.position;for(let e=0;e<i.count;e++){let t=i.getZ(e),n=i.getY(e);t>1.2?i.setY(e,n-(t-1.2)*.18):t<-1.4&&i.setY(e,n+.08)}r.computeVertexNormals(),this.bodyMesh=new q(r,this.bodyMaterial),this.bodyMesh.position.y=.48,this.bodyMesh.castShadow=!0,this.bodyMesh.receiveShadow=!0,t.add(this.bodyMesh);let a=new q(new Ti(1.48,.52,2.1),new $i({color:1118481,metalness:.1,roughness:.15,transmission:.75,transparent:!0,opacity:.85}));a.position.set(0,.88,-.2),a.castShadow=!0,t.add(a);let o=new Ti(.38,.12,.65),s=new Qi({color:1710618,roughness:.6,metalness:.8}),c=new q(o,s);c.position.set(0,1.18,.2),c.castShadow=!0,t.add(c);let l=this.bodyMaterial;for(let[e,n]of[[-.95,1.25],[.95,1.25],[-.95,-1.25],[.95,-1.25]]){let r=new Di(.48,.48,.18,16,1,!1,0,Math.PI);r.rotateZ(Math.PI/2),r.rotateY(e>0?-Math.PI/2:Math.PI/2);let i=new q(r,l);i.position.set(e,.45,n),i.castShadow=!0,t.add(i)}let u=new q(new Ti(1.82,.06,.45),s);u.position.set(0,.22,2.05),u.castShadow=!0,t.add(u);let d=new q(new Ti(1.72,.18,.48),s);d.position.set(0,.26,-2),d.castShadow=!0,t.add(d);let f=new Di(.065,.065,.35,12);f.rotateX(Math.PI/2);let p=new Qi({color:13421772,metalness:.95,roughness:.2}),m=new q(f,p);m.position.set(-.45,.24,-2.15);let h=new q(f,p);h.position.set(.45,.24,-2.15),t.add(m),t.add(h),this.carRoot.add(t),this.carBodyGroup=t}_buildInterior(){let e=new Qi({color:15658734,metalness:.8,roughness:.3}),t=new Di(.025,.025,1.8,8),n=new q(t,e);n.position.set(-.55,.85,-.2),n.rotateX(Math.PI/4);let r=new q(t,e);r.position.set(.55,.85,-.2),r.rotateX(-Math.PI/4),this.carBodyGroup.add(n),this.carBodyGroup.add(r);let i=new Vi(.18,.022,8,20),a=new Qi({color:1118481,roughness:.9});this.steeringWheel=new q(i,a),this.steeringWheel.position.set(-.35,.78,.35),this.steeringWheel.rotateX(-Math.PI/3.5),this.carBodyGroup.add(this.steeringWheel)}_buildWheels(e){let t={fl:{x:-.92,z:1.25},fr:{x:.92,z:1.25},rl:{x:-.92,z:-1.25},rr:{x:.92,z:-1.25}},n=e.visual_parts?.rimColor||`#f0f0f0`,r=e.visual_parts?.brakeCaliperColor||`#ff1a1a`,i=new Qi({color:1973790,roughness:.92,metalness:.08}),a=new Qi({color:new K(n),metalness:.85,roughness:.25}),o=new Qi({color:new K(r),metalness:.7,roughness:.3});for(let[e,n]of Object.entries(t)){let t=new Mn;t.name=`WheelAssembly_${e}`;let r=new Mn;r.name=`RotatingHub_${e}`;let s=new Di(this.wheelRadius,this.wheelRadius,this.wheelWidth,24);s.rotateZ(Math.PI/2);let c=new q(s,i);c.castShadow=!0,r.add(c);let l=new Di(this.wheelRadius*.75,this.wheelRadius*.75,this.wheelWidth*1.02,16);l.rotateZ(Math.PI/2);let u=new q(l,a);r.add(u);let d=new Di(this.wheelRadius*.65,this.wheelRadius*.65,.03,16);d.rotateZ(Math.PI/2);let f=new Qi({color:4473924,metalness:.95,roughness:.2,emissive:new K(0),emissiveIntensity:0}),p=new q(d,f);r.add(p),this.brakeDiscs[e]=f,t.add(r);let m=new q(new Ti(.12,.16,.18),o);m.position.set(n.x>0?-.06:.06,.12,0),t.add(m),t.position.set(n.x,.35,n.z),this.carRoot.add(t),this.wheelMeshes[e]={assembly:t,rotatingHub:r,baseY:.35,offset:n}}}_buildLighting(){let e=new jn;e.position.set(-.6,.3,15),this.carRoot.add(e);let t=new Ua(16777215,4,75,Math.PI/5,.45,1.2);t.position.set(-.65,.5,2),t.target=e,t.castShadow=!0,t.shadow.mapSize.width=1024,t.shadow.mapSize.height=1024,this.carRoot.add(t);let n=new jn;n.position.set(.6,.3,15),this.carRoot.add(n);let r=new Ua(16777215,4,75,Math.PI/5,.45,1.2);r.position.set(.65,.5,2),r.target=n,r.castShadow=!0,this.carRoot.add(r),this.headlights=[t,r];let i=new Qi({color:13369344,emissive:new K(16716049),emissiveIntensity:.8}),a=new Ti(.32,.12,.05),o=new q(a,i);o.position.set(-.7,.65,-2.05);let s=new q(a,i);s.position.set(.7,.65,-2.05),this.carBodyGroup.add(o),this.carBodyGroup.add(s),this.brakeLights=[o,s]}updateAeroKit(e){this.aeroGroup&&this.carBodyGroup.remove(this.aeroGroup),this.aeroGroup=new Mn,this.aeroGroup.name=`AeroKitGroup`;let t=new Qi({color:1579032,roughness:.4,metalness:.8});if(e===`wrc_spec_high_downforce`){let e=new q(new Ti(1.72,.05,.42),t);e.position.set(0,1.15,-1.85),e.rotateX(.12);let n=new Ti(.04,.38,.52),r=new q(n,t);r.position.set(-.86,1.15,-1.85);let i=new q(n,t);i.position.set(.86,1.15,-1.85);let a=new Di(.025,.025,.45),o=new q(a,t);o.position.set(-.45,.95,-1.85);let s=new q(a,t);s.position.set(.45,.95,-1.85),this.aeroGroup.add(e,r,i,o,s)}else if(e===`group_b_big_wing`){let e=new q(new Ti(1.85,.06,.5),t);e.position.set(0,1.25,-1.88),e.rotateX(.16);let n=new q(new Ti(1.85,.05,.4),t);n.position.set(0,1,-1.78),n.rotateX(.08);let r=new Ti(.05,.65,.65),i=new q(r,t);i.position.set(-.92,1.12,-1.85);let a=new q(r,t);a.position.set(.92,1.12,-1.85),this.aeroGroup.add(e,n,i,a)}else{let e=new q(new Ti(1.58,.12,.28),t);e.position.set(0,.78,-1.95),e.rotateX(.28),this.aeroGroup.add(e)}this.carBodyGroup.add(this.aeroGroup)}updateLightPods(e){if(this.lightPodGroup&&this.carBodyGroup.remove(this.lightPodGroup),this.lightPodGroup=new Mn,this.lightPodGroup.name=`LightPodGroup`,e===`quad_hella_hood`){let e=new Qi({color:1118481,roughness:.5}),t=new Qi({color:16777215,emissive:new K(16775904),emissiveIntensity:2.2});for(let n of[-.45,-.15,.15,.45]){let r=new Di(.11,.09,.12,16);r.rotateX(Math.PI/2);let i=new q(r,e),a=new q(new Ei(.1,16),t);a.position.z=.062,i.add(a),i.position.set(n,.76,1.45),this.lightPodGroup.add(i)}}else if(e===`led_lightbar`){let e=new q(new Ti(1.1,.08,.12),new Qi({color:657930,metalness:.9})),t=new q(new Ti(1.04,.05,.02),new Qi({color:16777215,emissive:new K(11200767),emissiveIntensity:3.5}));t.position.z=.065,e.add(t),e.position.set(0,.74,1.48),this.lightPodGroup.add(e)}this.carBodyGroup.add(this.lightPodGroup)}updateMudflaps(e){if(this.mudflapGroup&&this.carRoot.remove(this.mudflapGroup),e===`none`)return;this.mudflapGroup=new Mn,this.mudflapGroup.name=`MudflapGroup`;let t=new Qi({color:{rally_red:13840175,neon_yellow:13041408,stealth_black:2039583}[e]||13840175,roughness:.85}),n=new Ti(.24,.32,.02);for(let[e,r]of[[-.92,.95],[.92,.95],[-.92,-1.55],[.92,-1.55]]){let i=new q(n,t);i.position.set(e,.22,r),this.mudflapGroup.add(i)}this.carRoot.add(this.mudflapGroup)}loadLiveryTexture(e){let t={wrc_red:`/textures/livery_wrc_red.jpg`,mud_camo:`/textures/livery_mud_camo.jpg`,stealth_carbon:`/textures/livery_stealth_carbon.jpg`},n=t[e]||t.wrc_red;this.loadedTextures[n]?this._applyTexture(this.loadedTextures[n]):this.textureLoader.load(n,e=>{e.wrapS=s,e.wrapT=s,e.repeat.set(1.5,1.5),this.loadedTextures[n]=e,this._applyTexture(e)},void 0,e=>{console.warn(`[VehicleRenderer] Livery texture load error for ${n}:`,e)})}_applyTexture(e){this.bodyMaterial&&(this.bodyMaterial.map=e,this.bodyMaterial.needsUpdate=!0)}_setupEventListeners(){e.on(t.TUNING_UPDATED,({section:e,key:t,value:n,fullTuning:r})=>{if(e===`visual_parts`||e===`all`){let e=r.visual_parts;e.aeroKit&&this.updateAeroKit(e.aeroKit),e.lightPods&&this.updateLightPods(e.lightPods),e.mudflaps&&this.updateMudflaps(e.mudflaps),e.liveryPreset&&this.loadLiveryTexture(e.liveryPreset),e.bodyColor&&this.bodyMaterial&&this.bodyMaterial.color.set(e.bodyColor)}}),e.on(t.VISUAL_PART_CHANGED,({partType:e,value:t})=>{e===`aeroKit`&&this.updateAeroKit(t),e===`lightPods`&&this.updateLightPods(t),e===`mudflaps`&&this.updateMudflaps(t),e===`liveryPreset`&&this.loadLiveryTexture(t)})}update(e,t){if(!e)return;let{vehicle:n,suspension:r,tires:a,gForces:o}=e,s=i.physicsBridge||{};this.carRoot.position.set(e.position?.x||s.position?.x||0,e.position?.y||s.position?.y||.48,e.position?.z||s.position?.z||0);let c=(s.rotation?.yaw||0)*(Math.PI/180);this.carRoot.rotation.y=c;let l=o.longitudinalG*.05,u=o.lateralG*.065;this.carBodyGroup.rotation.x=l,this.carBodyGroup.rotation.z=-u,this.steeringWheel&&(this.steeringWheel.rotation.z=-(n.steeringAngleDeg*(Math.PI/180))*2.5);for(let[e,i]of Object.entries(this.wheelMeshes)){let o=r[e],s=a[e],c=(o.travelMm-140)/1e3;i.assembly.position.y=i.baseY+c,(e===`fl`||e===`fr`)&&(i.assembly.rotation.y=n.steeringAngleDeg*(Math.PI/180));let l=n.speedKph/3.6/this.wheelRadius*.016;i.rotatingHub.rotation.x+=l;let u=this.brakeDiscs[e];if(u&&(n.brake>.4&&n.speedKph>15?(u.emissive.setHex(16724736),u.emissiveIntensity=Nt.lerp(u.emissiveIntensity,n.brake*2.5,.1)):u.emissiveIntensity=Nt.lerp(u.emissiveIntensity,0,.05)),t){let e=new W;i.assembly.getWorldPosition(e),t.emitWheelDust(e,s.slipAngleDeg,n.speedKph/3.6)}}for(let e of this.brakeLights)e.material.emissiveIntensity=n.brake>.1?2.5:.6}},Ml=class{constructor(e){this.scene=e,this.maxDustParticles=600,this.maxFlameParticles=80,this.dustParticles=[],this.flameParticles=[],this._initDustMesh(),this._initFlameMesh(),this._setupListeners()}_initDustMesh(){let e=new Ai(.18,1);this.dustMaterial=new Qi({color:10389617,roughness:.95,metalness:.05,transparent:!0,opacity:.65,depthWrite:!1}),this.dustInstancedMesh=new gi(e,this.dustMaterial,this.maxDustParticles),this.dustInstancedMesh.instanceMatrix.setUsage(Ye),this.dustInstancedMesh.name=`RallyDustParticles`,this.scene.add(this.dustInstancedMesh),this.dummy=new jn;for(let e=0;e<this.maxDustParticles;e++)this.dustParticles.push({active:!1,x:0,y:0,z:0,vx:0,vy:0,vz:0,scale:.1,maxScale:1.2,life:0,maxLife:1,index:e}),this.dummy.position.set(0,-9999,0),this.dummy.scale.set(0,0,0),this.dummy.updateMatrix(),this.dustInstancedMesh.setMatrixAt(e,this.dummy.matrix);this.dustInstancedMesh.instanceMatrix.needsUpdate=!0}_initFlameMesh(){let e=new Bi(.08,6,6);this.flameMaterial=new qr({color:16742144,transparent:!0,opacity:.9,blending:2}),this.flameInstancedMesh=new gi(e,this.flameMaterial,this.maxFlameParticles),this.flameInstancedMesh.instanceMatrix.setUsage(Ye),this.flameInstancedMesh.name=`RallyExhaustFlames`,this.scene.add(this.flameInstancedMesh);for(let e=0;e<this.maxFlameParticles;e++)this.flameParticles.push({active:!1,x:0,y:0,z:0,vx:0,vy:0,vz:0,scale:.2,life:0,maxLife:.25,index:e}),this.dummy.position.set(0,-9999,0),this.dummy.scale.set(0,0,0),this.dummy.updateMatrix(),this.flameInstancedMesh.setMatrixAt(e,this.dummy.matrix);this.flameInstancedMesh.instanceMatrix.needsUpdate=!0}_setupListeners(){e.on(t.BACKFIRE_POP,()=>{this.spawnExhaustBackfire()}),e.on(t.STAGE_SELECTED,({stage:e})=>{this.updateSurfaceColor(e.surface)})}updateSurfaceColor(e){e===`snow`?(this.dustMaterial.color.setHex(15265007),this.dustMaterial.opacity=.75):e===`gravel`||e===`rocky`?(this.dustMaterial.color.setHex(10586239),this.dustMaterial.opacity=.65):(this.dustMaterial.color.setHex(13421772),this.dustMaterial.opacity=.45)}emitWheelDust(e,t,n){if(n<2&&Math.abs(t)<5)return;let r=Math.min(3,Math.floor(n/25+Math.abs(t)/8));for(let t=0;t<r;t++){let t=this.dustParticles.find(e=>!e.active);if(!t)break;t.active=!0,t.x=e.x+(Math.random()-.5)*.35,t.y=e.y+.08,t.z=e.z+(Math.random()-.5)*.35,t.vx=(Math.random()-.5)*1.8,t.vy=.6+Math.random()*1.6,t.vz=-(n*.25)+(Math.random()-.5)*1.2,t.scale=.15,t.maxScale=1+Math.random()*1.4,t.life=0,t.maxLife=.8+Math.random()*.8}}spawnExhaustBackfire(e){let t=e||new W(.55,.35,-2.15),n=12+Math.floor(Math.random()*10);for(let e=0;e<n;e++){let e=this.flameParticles.find(e=>!e.active);if(!e)break;e.active=!0,e.x=t.x+(Math.random()-.5)*.12,e.y=t.y+(Math.random()-.5)*.12,e.z=t.z-Math.random()*.3,e.vx=(Math.random()-.5)*.8,e.vy=(Math.random()-.5)*.6,e.vz=-2.5-Math.random()*3.5,e.scale=.25+Math.random()*.3,e.life=0,e.maxLife=.18+Math.random()*.12}}update(e){let t=!1,n=!1;for(let n of this.dustParticles){if(!n.active)continue;if(n.life+=e,n.life>=n.maxLife){n.active=!1,this.dummy.position.set(0,-9999,0),this.dummy.scale.set(0,0,0),this.dummy.updateMatrix(),this.dustInstancedMesh.setMatrixAt(n.index,this.dummy.matrix),t=!0;continue}let r=n.life/n.maxLife;n.vx*=.4**e,n.vy+=(.4-n.vy)*e*2,n.vz*=.4**e,n.x+=n.vx*e,n.y+=n.vy*e,n.z+=n.vz*e;let i=Nt.lerp(n.scale,n.maxScale,r);this.dummy.position.set(n.x,n.y,n.z),this.dummy.scale.set(i,i,i),this.dummy.updateMatrix(),this.dustInstancedMesh.setMatrixAt(n.index,this.dummy.matrix),t=!0}for(let t of this.flameParticles){if(!t.active)continue;if(t.life+=e,t.life>=t.maxLife){t.active=!1,this.dummy.position.set(0,-9999,0),this.dummy.scale.set(0,0,0),this.dummy.updateMatrix(),this.flameInstancedMesh.setMatrixAt(t.index,this.dummy.matrix),n=!0;continue}t.x+=t.vx*e,t.y+=t.vy*e,t.z+=t.vz*e;let r=(1-t.life/t.maxLife)*t.scale;this.dummy.position.set(t.x,t.y,t.z),this.dummy.scale.set(r,r,r),this.dummy.updateMatrix(),this.flameInstancedMesh.setMatrixAt(t.index,this.dummy.matrix),n=!0}t&&(this.dustInstancedMesh.instanceMatrix.needsUpdate=!0),n&&(this.flameInstancedMesh.instanceMatrix.needsUpdate=!0)}},Nl=class{constructor(e){this.camera=e,this.currentMode=i.cameraMode||`chase`,this.currentPosition=new W(0,5,-10),this.currentTarget=new W(0,1,0),this.chaseDistance=6.4,this.chaseHeight=2.1,this.chaseLookAtHeight=1.2,this.chaseLagDamping=6.5,this.heliAngle=0,this.heliHeight=24,this.heliDistance=38,this.vibrationOffset=new W,this._setupListeners()}_setupListeners(){e.on(t.CAMERA_VIEW_CHANGED,({mode:n})=>{this.currentMode=n,e.emit(t.NOTIFICATION,{title:`Camera Angle`,message:n.toUpperCase()})})}update(e,t,n){if(!t)return;let r=new W;t.getWorldPosition(r);let i=t.rotation.y,a=e?.vehicle?.speedKph||0,o=Math.min(1,a/180);this.currentMode===`chase`?this._updateChaseCamera(r,i,e,o,n):this.currentMode===`onboard`?this._updateOnboardCamera(r,i,e,n):this.currentMode===`helicopter`&&this._updateHelicopterCamera(r,n),this.camera.position.copy(this.currentPosition),this.camera.lookAt(this.currentTarget)}_updateChaseCamera(e,t,n,r,i){let a=62+r*14;this.camera.fov=Nt.lerp(this.camera.fov,a,i*4),this.camera.updateProjectionMatrix();let o=t-(n?.gForces?.yawRateDegS?n.gForces.yawRateDegS*.25:0)*Math.PI/180,s=e.x-Math.sin(o)*this.chaseDistance,c=e.z-Math.cos(o)*this.chaseDistance,l=new W(s,e.y+this.chaseHeight+r*.4,c),u=Math.min(1,i*this.chaseLagDamping);this.currentPosition.lerp(l,u);let d=new W(e.x+Math.sin(t)*4.5,e.y+this.chaseLookAtHeight,e.z+Math.cos(t)*4.5);this.currentTarget.lerp(d,u*1.5)}_updateOnboardCamera(e,t,n,r){this.camera.fov=74,this.camera.updateProjectionMatrix();let i=new W(0,.95,.45);i.applyAxisAngle(new W(0,1,0),t);let a=(n?.vehicle?.engineRpm||1200)/8e3*.008;this.vibrationOffset.set((Math.random()-.5)*a,(Math.random()-.5)*a,(Math.random()-.5)*a);let o=n?.gForces?.lateralG||0,s=n?.gForces?.longitudinalG||0,c=new W().copy(e).add(i).add(this.vibrationOffset);this.currentPosition.copy(c);let l=new W(e.x+Math.sin(t)*25+o*1.2,e.y+1.1+s*.8,e.z+Math.cos(t)*25);this.currentTarget.copy(l)}_updateHelicopterCamera(e,t){this.camera.fov=55,this.camera.updateProjectionMatrix(),this.heliAngle+=t*.15;let n=e.x+Math.sin(this.heliAngle)*this.heliDistance,r=e.z+Math.cos(this.heliAngle)*this.heliDistance,i=new W(n,e.y+this.heliHeight,r);this.currentPosition.lerp(i,t*2.5);let a=new W(e.x,e.y+.8,e.z);this.currentTarget.lerp(a,t*3.5)}},Pl=class{constructor(e){this.container=e,this.width=e.clientWidth||window.innerWidth,this.height=e.clientHeight||window.innerHeight,this.clock=new lo,this.lastTelemetry=null,this.scene=new Vn,this.camera=new Va(65,this.width/this.height,.1,2e3),this.renderer=new kl({powerPreference:`high-performance`,antialias:!0,alpha:!1}),this.renderer.setSize(this.width,this.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=2,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1.05,this.container.appendChild(this.renderer.domElement),this.stageMeshGen=new Al(this.scene),this.vehicleRenderer=new jl(this.scene),this.particleSystem=new Ml(this.scene),this.cameraRig=new Nl(this.camera),this.dirLight=null,this.hemiLight=null,this._setupEnvironmentLighting(),this.buildActiveStage(),a.setStageSpline(this.stageMeshGen),this._setupEventListeners(),this._startRenderLoop()}_setupEnvironmentLighting(){this.hemiLight=new ka(16772829,3351057,.7),this.scene.add(this.hemiLight),this.dirLight=new Ka(16775917,2.2),this.dirLight.position.set(250,300,-200),this.dirLight.castShadow=!0,this.dirLight.shadow.mapSize.width=2048,this.dirLight.shadow.mapSize.height=2048,this.dirLight.shadow.camera.near=10,this.dirLight.shadow.camera.far=800,this.dirLight.shadow.bias=-4e-4,this.dirLight.shadow.camera.left=-90,this.dirLight.shadow.camera.right=90,this.dirLight.shadow.camera.top=90,this.dirLight.shadow.camera.bottom=-90,this.scene.add(this.dirLight),this.scene.add(this.dirLight.target)}buildActiveStage(){let e=i.activeStage;if(!e)return;let t=e.ambientLighting||{};this.scene.background=new K(t.skyColor||8900331),this.scene.fog=new Bn(new K(t.fogColor||11584734),t.fogDensity||6e-4),this.hemiLight&&(this.hemiLight.color.set(t.skyColor||16772829),this.hemiLight.groundColor.set(t.groundColor||4073251)),this.dirLight&&(this.dirLight.color.set(t.sunColor||16775917),t.sunPosition&&this.dirLight.position.set(t.sunPosition[0],t.sunPosition[1],t.sunPosition[2])),this.stageMeshGen.buildStage(e),a.setStageSpline(this.stageMeshGen)}_setupEventListeners(){window.addEventListener(`resize`,this.onResize),e.on(t.TELEMETRY_UPDATE,e=>{this.lastTelemetry=e}),e.on(t.STAGE_SELECTED,()=>{this.buildActiveStage()}),e.on(t.STAGE_COMPILED,()=>{this.buildActiveStage()})}onResize=()=>{this.width=this.container.clientWidth||window.innerWidth,this.height=this.container.clientHeight||window.innerHeight,this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.width,this.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.emit(t.VIEWPORT_RESIZED,{width:this.width,height:this.height})};_startRenderLoop=()=>{requestAnimationFrame(this._startRenderLoop);let e=Math.min(this.clock.getDelta(),.1);if(this.lastTelemetry&&(this.vehicleRenderer.update(this.lastTelemetry,this.particleSystem),this.dirLight&&this.vehicleRenderer.carRoot)){let e=this.vehicleRenderer.carRoot.position;this.dirLight.target.position.set(e.x,e.y,e.z),this.dirLight.target.updateMatrixWorld()}this.particleSystem.update(e),this.vehicleRenderer.carRoot&&this.cameraRig.update(this.lastTelemetry,this.vehicleRenderer.carRoot,e),this.renderer.render(this.scene,this.camera)}},Fl=class{constructor(e){this.container=e,this.canvas=document.createElement(`canvas`),this.canvas.className=`elevation-canvas`,this.ctx=this.canvas.getContext(`2d`),this.container.appendChild(this.canvas),this.stageData=null,this.hoverDistance=null,this._bindEvents()}_bindEvents(){this.canvas.addEventListener(`mousemove`,e=>{let t=this.canvas.getBoundingClientRect(),n=e.clientX-t.left,r=Math.max(0,Math.min(1,n/t.width));this.stageData&&(this.hoverDistance=r*(this.stageData.totalLengthMeters||4200),this.render())}),this.canvas.addEventListener(`mouseleave`,()=>{this.hoverDistance=null,this.render()}),window.addEventListener(`resize`,()=>{this.resize()})}resize(){let e=this.container.clientWidth||600,t=this.container.clientHeight||180,n=window.devicePixelRatio||1;this.canvas.width=e*n,this.canvas.height=t*n,this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`,this.ctx.scale(n,n),this.render()}setStageData(e){this.stageData=e,this.resize()}render(){if(!this.stageData)return;let e=this.canvas.clientWidth||600,t=this.canvas.clientHeight||180,n=this.ctx;n.clearRect(0,0,e,t);let r=this.stageData.waypoints||[];if(r.length<2)return;let i=r.map(e=>e.elevation||0),a=Math.min(...i),o=Math.max(...i),s=Math.max(20,o-a),c=e-45-20,l=t-25-30;n.strokeStyle=`rgba(255, 255, 255, 0.08)`,n.lineWidth=1,n.fillStyle=`#888888`,n.font=`10px monospace`,n.textAlign=`right`;for(let t=0;t<=4;t++){let r=25+t/4*l,i=Math.round(o-t/4*s);n.beginPath(),n.moveTo(45,r),n.lineTo(e-20,r),n.stroke(),n.fillText(`${i}m`,39,r+3)}let u=n.createLinearGradient(0,25,0,t-30);u.addColorStop(0,`rgba(225, 6, 0, 0.55)`),u.addColorStop(1,`rgba(225, 6, 0, 0.02)`),n.beginPath(),n.moveTo(45,t-30);let d=r.map(e=>({x:45+e.distance/(this.stageData.totalLengthMeters||4200)*c,y:25+(1-(e.elevation-a)/s)*l,wp:e}));if(d.forEach((e,t)=>{n.lineTo(e.x,e.y)}),n.lineTo(45+c,t-30),n.closePath(),n.fillStyle=u,n.fill(),n.beginPath(),n.strokeStyle=`#ff3333`,n.lineWidth=2.5,d.forEach((e,t)=>{t===0?n.moveTo(e.x,e.y):n.lineTo(e.x,e.y)}),n.stroke(),this.stageData.pacenotes){for(let e of this.stageData.pacenotes)if(e.type===`jump`||e.type===`hairpin`||e.call.includes(`Crest`)){let t=45+e.distance/(this.stageData.totalLengthMeters||4200)*c,r=25+l*.5;for(let e=0;e<d.length-1;e++)if(t>=d[e].x&&t<=d[e+1].x){let n=(t-d[e].x)/(d[e+1].x-d[e].x);r=d[e].y+n*(d[e+1].y-d[e].y);break}n.fillStyle=e.type===`jump`?`#ffd600`:`#00e5ff`,n.beginPath(),n.arc(t,r,4,0,Math.PI*2),n.fill()}}if(this.hoverDistance!==null){let r=45+this.hoverDistance/(this.stageData.totalLengthMeters||4200)*c;n.strokeStyle=`#ffffff`,n.lineWidth=1,n.setLineDash([4,4]),n.beginPath(),n.moveTo(r,25),n.lineTo(r,t-30),n.stroke(),n.setLineDash([]),n.fillStyle=`rgba(15, 15, 15, 0.88)`,n.strokeStyle=`#ff3333`,n.lineWidth=1,n.beginPath(),n.roundRect(Math.min(r+8,e-130),33,115,38,4),n.fill(),n.stroke(),n.fillStyle=`#ffffff`,n.font=`bold 10px monospace`,n.textAlign=`left`,n.fillText(`Dist: ${(this.hoverDistance/1e3).toFixed(2)} km`,Math.min(r+16,e-122),47);let i=a+(1-l*.5/l)*s;n.fillStyle=`#ff8888`,n.fillText(`Alt: ${Math.round(i)}m`,Math.min(r+16,e-122),61)}}},Il=class{static compile(e){let{id:t,name:n,surface:r,weather:i,gpsPoints:a}=e;if(!a||a.length<2)throw Error(`Stage requires at least 2 GPS waypoints to compile.`);let o=a[0],s=a[a.length-1],c=[],l=0;for(let e=0;e<a.length;e++){let t=a[e],n=o.lat*Math.PI/180,i=(t.lat-o.lat)*111320,s=(t.lon-o.lon)*(111320*Math.cos(n)),u=(t.alt||100)-(o.alt||100);if(e>0){let t=c[e-1],n=Math.hypot(s-t.x,i-t.z);l+=n}c.push({distance:Math.round(l),x:Math.round(s*10)/10,y:Math.round(u*10)/10,z:Math.round(i*10)/10,lat:t.lat,lon:t.lon,elevation:t.alt||100,camber:0,width:r===`gravel`?6.8:5.8})}for(let e=1;e<c.length-1;e++){let t=c[e-1],n=c[e],r=c[e+1],i={x:n.x-t.x,z:n.z-t.z},a={x:r.x-n.x,z:r.z-n.z},o=i.x*a.z-i.z*a.x;n.camber=Math.max(-.08,Math.min(.08,o/1e4*.05))}let u=this._generatePacenotes(c),d={tarmac:.98,gravel:.82,rocky:.74,snow:.58},f={sunset:{skyColor:`#ff7043`,groundColor:`#3e2723`,sunColor:`#ffab91`,sunPosition:[300,200,-400],fogDensity:7e-4,fogColor:`#d38067`},sunny:{skyColor:`#90caf9`,groundColor:`#2e7d32`,sunColor:`#fff9c4`,sunPosition:[400,500,-200],fogDensity:4e-4,fogColor:`#cce5ff`},night:{skyColor:`#0d1b2a`,groundColor:`#0a0f18`,sunColor:`#1b263b`,sunPosition:[100,100,100],fogDensity:.0012,fogColor:`#0b1320`},overcast:{skyColor:`#b0bec5`,groundColor:`#37474f`,sunColor:`#cfd8dc`,sunPosition:[200,350,100],fogDensity:8e-4,fogColor:`#90a4ae`}};return{id:t||`stage_custom_${Date.now()}`,name:n||`Custom GPS Rally Stage`,region:`Custom GPS Stage Coordinates`,surface:r||`gravel`,surfaceGripCoefficient:d[r]||.85,weather:i||`sunset`,totalLengthMeters:Math.round(l),elevationGainMeters:Math.round(Math.abs((s.alt||100)-(o.alt||100))),baseRoadWidthMeters:r===`gravel`?6.8:5.8,shoulderWidthMeters:1.2,ambientLighting:f[i]||f.sunset,startPoint:o,endPoint:s,waypoints:c,pacenotes:u}}static _generatePacenotes(e){let t=[];t.push({distance:60,call:`Start Flat 100`,type:`straight`,severity:6,direction:`straight`,modifier:`flat`,detail:`Clean launch`});for(let n=1;n<e.length-1;n++){let r=e[n-1],i=e[n],a=e[n+1],o=i.x-r.x,s=i.z-r.z,c=a.x-i.x,l=a.z-i.z,u=o*c+s*l,d=Math.hypot(o,s),f=Math.hypot(c,l);if(d>0&&f>0){let e=Math.max(-1,Math.min(1,u/(d*f))),n=180/Math.PI*Math.acos(e),a=o*l-s*c>0?`right`:`left`,p=i.y-r.y>8;if(n>10){let e=6,r=``,o=`turn`;n>=85?(e=1,r=`Caution Hairpin ${a.toUpperCase()} Don't Cut`,o=`hairpin`):n>=60?(e=2,r=`${a.toUpperCase()} 2 Tightens`):n>=40?(e=3,r=`${a.toUpperCase()} 3 into Left 3`):n>=25?(e=4,r=`${a.toUpperCase()} 4 ${p?`over Crest`:`100`}`):n>=15?(e=5,r=`${a.toUpperCase()} 5 Long`):(e=6,r=`Flat ${a.toUpperCase()} 150`),t.push({distance:i.distance,call:r,type:o,severity:e,direction:a,modifier:n>=85?`caution`:p?`crest`:`flat`,detail:`${Math.round(n)}° turn`})}else p&&t.push({distance:i.distance,call:`Jump over Crest stay middle`,type:`jump`,severity:6,direction:`straight`,modifier:`jump`,detail:`Big airtime`})}}let n=e[e.length-1];return t.push({distance:n.distance-80,call:`Flying Finish into Stop Control`,type:`finish`,severity:6,direction:`straight`,modifier:`finish`,detail:`Full commit across line`}),t}},Ll=class{constructor(e){this.container=e,this.customWaypoints=[],this.isDrawing=!1,this.elevationGraph=null,this.renderUI(),this._initElevationGraph(),this._initMapCanvas(),this._bindEvents()}renderUI(){this.container.innerHTML=`
      <div class="stage-picker-container glass-panel">
        <div class="stage-picker-header">
          <div class="header-title">
            <span class="icon">📍</span>
            <h2>WRC STAGE PICKER & ROUTE PLANNER</h2>
          </div>
          <span class="badge live-badge">GPS TELEMETRY READY</span>
        </div>

        <div class="stage-picker-grid">
          <!-- Left Column: Preset Stages & Custom Setup -->
          <div class="stage-presets-panel">
            <h3 class="panel-section-title">CHAMPIONSHIP STAGES</h3>
            <div class="stage-cards-list" id="stageCardsList"></div>

            <div class="custom-route-controls glass-subpanel">
              <h3 class="panel-section-title">CUSTOM ROUTE COMPILER</h3>
              <div class="form-row">
                <label>Stage Name</label>
                <input type="text" id="customStageName" value="Monte Spline Custom Pass" class="rally-input" />
              </div>
              <div class="form-grid-2">
                <div class="form-row">
                  <label>Surface Type</label>
                  <select id="customSurfaceSelect" class="rally-select">
                    <option value="tarmac">Asphalt (High Grip)</option>
                    <option value="gravel" selected>Loose Gravel (Medium)</option>
                    <option value="rocky">Rocky Mountain (Low Grip)</option>
                    <option value="snow">Packed Snow / Ice (Slippery)</option>
                  </select>
                </div>
                <div class="form-row">
                  <label>Weather / Lighting</label>
                  <select id="customWeatherSelect" class="rally-select">
                    <option value="sunset" selected>Golden Sunset</option>
                    <option value="sunny">High Noon Sun</option>
                    <option value="night">Dark Night (Light Pods)</option>
                    <option value="overcast">Overcast Mist</option>
                  </select>
                </div>
              </div>

              <div class="map-action-buttons">
                <button id="btnResetWaypoints" class="rally-btn secondary">Clear Route</button>
                <button id="btnCompileStage" class="rally-btn primary pulse">
                  <span>⚡ Compile & Deploy Stage</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column: Interactive Map Canvas & Elevation Profile -->
          <div class="stage-map-panel">
            <div class="map-toolbar">
              <div class="map-mode-tabs">
                <span class="tab-label">GPS SPLINE EDITOR (Click to add waypoints, drag to adjust path)</span>
              </div>
              <div class="waypoint-counter" id="waypointCountBadge">3 Waypoints</div>
            </div>

            <div class="map-canvas-container" id="mapCanvasContainer">
              <canvas id="stageMapCanvas" class="stage-map-canvas"></canvas>
              <div class="map-overlay-instructions">
                <span>🖱️ Click canvas to add rally waypoints. Drag start/finish markers.</span>
              </div>
            </div>

            <div class="elevation-profile-container">
              <div class="profile-header">
                <h4>STAGE ELEVATION PROFILE</h4>
                <div class="elev-stats" id="elevStatsDisplay">Gain: 380m | Max Grade: 14%</div>
              </div>
              <div id="elevationGraphMount" class="elevation-graph-mount"></div>
            </div>
          </div>
        </div>
      </div>
    `}_initElevationGraph(){let e=this.container.querySelector(`#elevationGraphMount`);e&&(this.elevationGraph=new Fl(e),this.elevationGraph.setStageData(i.activeStage))}_initMapCanvas(){this.mapCanvas=this.container.querySelector(`#stageMapCanvas`),this.mapContainer=this.container.querySelector(`#mapCanvasContainer`),this.mapCtx=this.mapCanvas.getContext(`2d`),this._resizeMapCanvas(),this._loadWaypointsFromStage(i.activeStage),this.draggedWpIndex=-1,this.mapCanvas.addEventListener(`mousedown`,e=>{let t=this.mapCanvas.getBoundingClientRect(),n=e.clientX-t.left,r=e.clientY-t.top;if(this.draggedWpIndex=this.customWaypoints.findIndex(e=>Math.hypot(e.canvasX-n,e.canvasY-r)<16),this.draggedWpIndex===-1){let e=1100+Math.floor(Math.random()*450);this.customWaypoints.push({canvasX:n,canvasY:r,lat:43.98+r/this.mapCanvas.clientHeight*.03,lon:7.39+n/this.mapCanvas.clientWidth*.03,alt:e}),this._updateWaypointBadge(),this.drawMap(),this._previewCustomStage()}}),this.mapCanvas.addEventListener(`mousemove`,e=>{if(this.draggedWpIndex!==-1){let t=this.mapCanvas.getBoundingClientRect(),n=e.clientX-t.left,r=e.clientY-t.top,i=this.customWaypoints[this.draggedWpIndex];i.canvasX=n,i.canvasY=r,i.lat=43.98+r/this.mapCanvas.clientHeight*.03,i.lon=7.39+n/this.mapCanvas.clientWidth*.03,this.drawMap(),this._previewCustomStage()}}),window.addEventListener(`mouseup`,()=>{this.draggedWpIndex=-1}),window.addEventListener(`resize`,()=>{this._resizeMapCanvas(),this.drawMap()})}_resizeMapCanvas(){if(!this.mapCanvas||!this.mapContainer)return;let e=this.mapContainer.clientWidth||640,t=this.mapContainer.clientHeight||320,n=window.devicePixelRatio||1;this.mapCanvas.width=e*n,this.mapCanvas.height=t*n,this.mapCanvas.style.width=`${e}px`,this.mapCanvas.style.height=`${t}px`,this.mapCtx.scale(n,n)}_loadWaypointsFromStage(e){if(!e||!e.waypoints)return;let t=this.mapCanvas.clientWidth||640,n=this.mapCanvas.clientHeight||320,r=e.waypoints,i=Math.min(...r.map(e=>e.x)),a=Math.max(...r.map(e=>e.x)),o=Math.min(...r.map(e=>e.z)),s=Math.max(...r.map(e=>e.z)),c=Math.max(1,a-i),l=Math.max(1,s-o);this.customWaypoints=r.map(e=>({canvasX:60+(e.x-i)/c*(t-120),canvasY:50+(e.z-o)/l*(n-100),lat:e.lat||43.98,lon:e.lon||7.39,alt:e.elevation||1200})),this._updateWaypointBadge(),this.drawMap()}_updateWaypointBadge(){let e=this.container.querySelector(`#waypointCountBadge`);e&&(e.textContent=`${this.customWaypoints.length} GPS Waypoints`)}drawMap(){if(!this.mapCanvas||!this.mapCtx)return;let e=this.mapCanvas.clientWidth||640,t=this.mapCanvas.clientHeight||320,n=this.mapCtx;n.clearRect(0,0,e,t),n.fillStyle=`#141c24`,n.fillRect(0,0,e,t),n.strokeStyle=`rgba(255, 255, 255, 0.04)`,n.lineWidth=1;for(let r=40;r<e+200;r+=50)n.beginPath(),n.arc(e*.45,t*.55,r,0,Math.PI*2),n.stroke();n.strokeStyle=`rgba(70, 130, 180, 0.15)`;for(let r=0;r<e;r+=60)n.beginPath(),n.moveTo(r,0),n.lineTo(r,t),n.stroke();for(let r=0;r<t;r+=60)n.beginPath(),n.moveTo(0,r),n.lineTo(e,r),n.stroke();if(this.customWaypoints.length<2)return;n.strokeStyle=`#e10600`,n.lineWidth=4,n.lineCap=`round`,n.lineJoin=`round`,n.shadowColor=`rgba(225, 6, 0, 0.6)`,n.shadowBlur=10,n.beginPath(),n.moveTo(this.customWaypoints[0].canvasX,this.customWaypoints[0].canvasY);for(let e=1;e<this.customWaypoints.length;e++){let t=this.customWaypoints[e-1],r=this.customWaypoints[e],i=(t.canvasX+r.canvasX)/2,a=(t.canvasY+r.canvasY)/2;n.quadraticCurveTo(t.canvasX,t.canvasY,i,a)}let r=this.customWaypoints[this.customWaypoints.length-1];n.lineTo(r.canvasX,r.canvasY),n.stroke(),n.shadowBlur=0,this.customWaypoints.forEach((e,t)=>{let r=t===0,i=t===this.customWaypoints.length-1;n.beginPath(),n.arc(e.canvasX,e.canvasY,r||i?9:6,0,Math.PI*2),r?(n.fillStyle=`#00e676`,n.strokeStyle=`#ffffff`):i?(n.fillStyle=`#ff1744`,n.strokeStyle=`#ffffff`):(n.fillStyle=`#ffd600`,n.strokeStyle=`#111111`),n.lineWidth=2,n.fill(),n.stroke(),n.fillStyle=`#ffffff`,n.font=`bold 9px monospace`,n.textAlign=`center`;let a=r?`START`:i?`FINISH`:`WP${t}`;n.fillText(a,e.canvasX,e.canvasY-12)})}_previewCustomStage(){if(!(this.customWaypoints.length<2))try{let e=this.container.querySelector(`#customSurfaceSelect`)?.value||`gravel`,t=this.container.querySelector(`#customWeatherSelect`)?.value||`sunset`,n=this.container.querySelector(`#customStageName`)?.value||`Custom GPS Rally Stage`,r=Il.compile({id:`stage_custom_preview`,name:n,surface:e,weather:t,gpsPoints:this.customWaypoints.map(e=>({lat:e.lat,lon:e.lon,alt:e.alt}))});this.elevationGraph&&this.elevationGraph.setStageData(r);let i=this.container.querySelector(`#elevStatsDisplay`);i&&(i.textContent=`Length: ${(r.totalLengthMeters/1e3).toFixed(2)}km | Gain: ${r.elevationGainMeters}m | Corners: ${r.pacenotes.length}`)}catch{}}_bindEvents(){let n=this.container.querySelector(`#stageCardsList`);if(n){let e=i.stageConfig.stages;n.innerHTML=Object.values(e).map(e=>`
          <div class="stage-preset-card ${e.id===i.activeStageId?`active`:``}" data-stage-id="${e.id}">
            <div class="card-top">
              <span class="stage-country-flag">${e.surface===`tarmac`?`🇲🇨`:e.surface===`gravel`?`🇫🇮`:`🇬🇷`}</span>
              <h4>${e.name}</h4>
            </div>
            <div class="card-meta">
              <span>Surface: <strong>${e.surface.toUpperCase()}</strong></span>
              <span>Length: <strong>${(e.totalLengthMeters/1e3).toFixed(1)} km</strong></span>
              <span>Gain: <strong>+${e.elevationGainMeters}m</strong></span>
            </div>
          </div>
        `).join(``),n.querySelectorAll(`.stage-preset-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.stageId;n.querySelectorAll(`.stage-preset-card`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),i.setActiveStage(t),this._loadWaypointsFromStage(i.activeStage),this.elevationGraph&&this.elevationGraph.setStageData(i.activeStage)})})}let r=this.container.querySelector(`#btnResetWaypoints`);r&&r.addEventListener(`click`,()=>{this.customWaypoints=[],this._updateWaypointBadge(),this.drawMap()});let a=this.container.querySelector(`#btnCompileStage`);a&&a.addEventListener(`click`,()=>{if(this.customWaypoints.length<2){alert(`Please click on the map to place at least 2 waypoints (Start and Finish).`);return}let n=this.container.querySelector(`#customSurfaceSelect`).value,r=this.container.querySelector(`#customWeatherSelect`).value,a=this.container.querySelector(`#customStageName`).value||`Custom WRC Stage`,o=Il.compile({id:`custom_stage_${Date.now()}`,name:a,surface:n,weather:r,gpsPoints:this.customWaypoints.map(e=>({lat:e.lat,lon:e.lon,alt:e.alt}))});i.setCompiledStage(o),e.emit(t.NOTIFICATION,{title:`Stage Compiled!`,message:`${a} (${(o.totalLengthMeters/1e3).toFixed(2)} km) ready for racing.`}),i.setActiveTab(`stage_drive`)})}},Rl=class{constructor(e){this.container=e,this.render(),this._bindEvents()}render(){let e=i.currentTuning.visual_parts||{};this.container.innerHTML=`
      <div class="part-customizer-panel glass-subpanel">
        <h3 class="panel-section-title">VISUAL AERODYNAMICS & RALLY UPGRADES</h3>

        <!-- 1. Aero Kits -->
        <div class="customizer-group">
          <label class="group-label">AERODYNAMIC KIT</label>
          <div class="part-toggle-grid">
            <button class="part-option-btn ${e.aeroKit===`wrc_spec_high_downforce`?`active`:``}" data-part="aeroKit" data-val="wrc_spec_high_downforce">
              <span class="btn-name">WRC Spec Aero</span>
              <span class="btn-sub">Swan-neck wing + Endplates</span>
            </button>
            <button class="part-option-btn ${e.aeroKit===`group_b_big_wing`?`active`:``}" data-part="aeroKit" data-val="group_b_big_wing">
              <span class="btn-name">Group B Monster</span>
              <span class="btn-sub">Dual-plane mega wing</span>
            </button>
            <button class="part-option-btn ${e.aeroKit===`gravel_clubman`?`active`:``}" data-part="aeroKit" data-val="gravel_clubman">
              <span class="btn-name">Clubman Ducktail</span>
              <span class="btn-sub">Low drag gravel spoiler</span>
            </button>
          </div>
        </div>

        <!-- 2. Rally Light Pods -->
        <div class="customizer-group">
          <label class="group-label">HOOD AUXILIARY LIGHT PODS</label>
          <div class="part-toggle-grid">
            <button class="part-option-btn ${e.lightPods===`quad_hella_hood`?`active`:``}" data-part="lightPods" data-val="quad_hella_hood">
              <span class="btn-name">Quad Hella Pods</span>
              <span class="btn-sub">4x 100W Night Spotlights</span>
            </button>
            <button class="part-option-btn ${e.lightPods===`led_lightbar`?`active`:``}" data-part="lightPods" data-val="led_lightbar">
              <span class="btn-name">Baja LED Bar</span>
              <span class="btn-sub">Ultra-bright floodlight</span>
            </button>
            <button class="part-option-btn ${e.lightPods===`clean_stock`?`active`:``}" data-part="lightPods" data-val="clean_stock">
              <span class="btn-name">Clean Aerodynamic</span>
              <span class="btn-sub">Stock daytime hood</span>
            </button>
          </div>
        </div>

        <!-- 3. Mudflaps -->
        <div class="customizer-group">
          <label class="group-label">GRAVEL MUDFLAPS</label>
          <div class="part-toggle-grid-4">
            <button class="part-option-btn ${e.mudflaps===`rally_red`?`active`:``}" data-part="mudflaps" data-val="rally_red">
              <span class="color-dot red"></span>
              <span>WRC Red</span>
            </button>
            <button class="part-option-btn ${e.mudflaps===`neon_yellow`?`active`:``}" data-part="mudflaps" data-val="neon_yellow">
              <span class="color-dot yellow"></span>
              <span>Neon Lime</span>
            </button>
            <button class="part-option-btn ${e.mudflaps===`stealth_black`?`active`:``}" data-part="mudflaps" data-val="stealth_black">
              <span class="color-dot black"></span>
              <span>Stealth</span>
            </button>
            <button class="part-option-btn ${e.mudflaps===`none`?`active`:``}" data-part="mudflaps" data-val="none">
              <span>None</span>
            </button>
          </div>
        </div>

        <!-- 4. AI-Generated Liveries -->
        <div class="customizer-group">
          <label class="group-label">AI-GENERATED RALLY LIVERY DECALS</label>
          <div class="livery-card-grid">
            <div class="livery-card ${e.liveryPreset===`wrc_red`?`active`:``}" data-part="liveryPreset" data-val="wrc_red">
              <div class="livery-thumb" style="background-image: url('/textures/livery_wrc_red.jpg')"></div>
              <div class="livery-info">
                <h4>Apex WRC Championship</h4>
                <p>Bold red/white stripes, sponsor badges, #07</p>
              </div>
            </div>
            <div class="livery-card ${e.liveryPreset===`mud_camo`?`active`:``}" data-part="liveryPreset" data-val="mud_camo">
              <div class="livery-thumb" style="background-image: url('/textures/livery_mud_camo.jpg')"></div>
              <div class="livery-info">
                <h4>Splinter Mud Camo</h4>
                <p>Geometric dirt camo, neon-lime accents, #44</p>
              </div>
            </div>
            <div class="livery-card ${e.liveryPreset===`stealth_carbon`?`active`:``}" data-part="liveryPreset" data-val="stealth_carbon">
              <div class="livery-thumb" style="background-image: url('/textures/livery_stealth_carbon.jpg')"></div>
              <div class="livery-info">
                <h4>Quantum Stealth Carbon</h4>
                <p>Woven carbon matrix, neon cyan vectors, #88</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Paint & Finish -->
        <div class="customizer-group">
          <label class="group-label">PAINT FINISH & COLOR</label>
          <div class="color-pickers-row">
            <div class="color-picker-item">
              <span>Body Paint:</span>
              <input type="color" id="inputBodyColor" value="${e.bodyColor||`#e10600`}" class="color-input" />
            </div>
            <div class="color-picker-item">
              <span>Rims:</span>
              <input type="color" id="inputRimColor" value="${e.rimColor||`#f0f0f0`}" class="color-input" />
            </div>
            <div class="color-picker-item">
              <span>Brake Calipers:</span>
              <input type="color" id="inputCaliperColor" value="${e.brakeCaliperColor||`#ff1a1a`}" class="color-input" />
            </div>
          </div>
        </div>
      </div>
    `}_bindEvents(){this.container.querySelectorAll(`.part-option-btn, .livery-card`).forEach(n=>{n.addEventListener(`click`,()=>{let r=n.dataset.part,a=n.dataset.val;n.parentElement.querySelectorAll(`[data-part="${r}"]`).forEach(e=>e.classList.remove(`active`)),n.classList.add(`active`),i.updateTuningParameter(`visual_parts`,r,a),e.emit(t.VISUAL_PART_CHANGED,{partType:r,value:a})})});let n=this.container.querySelector(`#inputBodyColor`);n&&n.addEventListener(`input`,e=>{i.updateTuningParameter(`visual_parts`,`bodyColor`,e.target.value)});let r=this.container.querySelector(`#inputRimColor`);r&&r.addEventListener(`input`,e=>{i.updateTuningParameter(`visual_parts`,`rimColor`,e.target.value)});let a=this.container.querySelector(`#inputCaliperColor`);a&&a.addEventListener(`input`,e=>{i.updateTuningParameter(`visual_parts`,`brakeCaliperColor`,e.target.value)})}},zl=class{constructor(e){this.canvas=e,this.ctx=this.canvas.getContext(`2d`),this.tuning=null,this.resize()}resize(){if(!this.canvas)return;let e=this.canvas.clientWidth||450,t=this.canvas.clientHeight||180,n=window.devicePixelRatio||1;this.canvas.width=e*n,this.canvas.height=t*n,this.ctx.scale(n,n),this.render()}updateTuning(e){this.tuning=e,this.render()}render(){if(!this.canvas||!this.ctx||!this.tuning)return;let e=this.canvas.clientWidth||450,t=this.canvas.clientHeight||180,n=this.ctx;n.clearRect(0,0,e,t);let r=e-40-15,i=t-20-25,a=this.tuning.engine?.maxRpm||8400;n.strokeStyle=`rgba(255, 255, 255, 0.07)`,n.lineWidth=1,n.fillStyle=`#777777`,n.font=`9px monospace`,n.textAlign=`right`;for(let t=2e3;t<=a;t+=2e3){let r=20+(1-t/a)*i;n.beginPath(),n.moveTo(40,r),n.lineTo(e-15,r),n.stroke(),n.fillText(`${t/1e3}k`,34,r+3)}n.textAlign=`center`;for(let e=50;e<=240;e+=50){let i=40+e/240*r;n.beginPath(),n.moveTo(i,20),n.lineTo(i,t-25),n.stroke(),n.fillText(`${e}`,i,t-25+14)}let o=this.tuning.transmission?.gearRatios||[3.45,2.38,1.76,1.35,1.08,.89],s=this.tuning.transmission?.finalDriveRatio||4.18,c=.33,l=[`#ff5252`,`#ff7a00`,`#ffd600`,`#00e676`,`#00e5ff`,`#d500f9`];o.forEach((t,o)=>{let u=t*s,d=a/u*(2*Math.PI*c)*(60/1e3),f=40+1200/u*(2*Math.PI*c)*(60/1e3)/240*r,p=20+(1-1200/a)*i,m=40+Math.min(240,d)/240*r;n.strokeStyle=l[o%l.length],n.lineWidth=2.5,n.beginPath(),n.moveTo(f,p),n.lineTo(m,20),n.stroke(),n.fillStyle=l[o%l.length],n.font=`bold 10px monospace`,n.textAlign=`center`,n.fillText(`G${o+1}`,Math.min(e-15-10,m),14)}),n.fillStyle=`#aaaaaa`,n.font=`10px monospace`,n.textAlign=`left`,n.fillText(`SPEED (KM/H) VS RPM`,40,14)}},Bl=class{constructor(e){this.container=e,this.dynoChart=null,this.partCustomizer=null,this.render(),this._initSubcomponents(),this._bindEvents()}render(){let e=i.currentTuning,t=e.suspension||{},n=e.differential||{},r=e.transmission||{},a=e.tires_and_brakes||{};this.container.innerHTML=`
      <div class="tuning-studio-container glass-panel">
        <div class="studio-header">
          <div class="header-left">
            <span class="icon">🔧</span>
            <h2>3D GARAGE & MECHANICAL TUNING STUDIO</h2>
          </div>
          <div class="header-actions">
            <button id="btnExportTuningJson" class="rally-btn secondary">📥 Export JSON</button>
            <button id="btnResetDefaults" class="rally-btn secondary">Reset Setup</button>
            <button id="btnApplyAndDrive" class="rally-btn primary pulse">🏎️ Drive Active Setup</button>
          </div>
        </div>

        <!-- Preset Quick Bar -->
        <div class="tuning-presets-bar">
          <span class="bar-title">TUNING PRESETS:</span>
          <div class="preset-pill-list" id="presetPillsList">
            <button class="preset-pill ${i.activeProfile===`asphalt_monte_carlo`?`active`:``}" data-preset="asphalt_monte_carlo">Monte Carlo Tarmac</button>
            <button class="preset-pill ${i.activeProfile===`gravel_finland_jumps`?`active`:``}" data-preset="gravel_finland_jumps">Finland Jumps</button>
            <button class="preset-pill ${i.activeProfile===`acropolis_rocky_gravel`?`active`:``}" data-preset="acropolis_rocky_gravel">Acropolis Gravel</button>
            <button class="preset-pill ${i.activeProfile===`monte_carlo_night_ice`?`active`:``}" data-preset="monte_carlo_night_ice">Col de Turini Ice</button>
          </div>
        </div>

        <div class="tuning-studio-grid">
          <!-- Column 1: Mechanical Tuning Sliders -->
          <div class="mechanical-sliders-panel">
            <!-- Tabs -->
            <div class="tuning-subtabs">
              <button class="subtab-btn active" data-subtab="tab-suspension">Suspension</button>
              <button class="subtab-btn" data-subtab="tab-diff">Differential</button>
              <button class="subtab-btn" data-subtab="tab-gears">Gears & Dyno</button>
              <button class="subtab-btn" data-subtab="tab-tires">Tires & Brakes</button>
            </div>

            <!-- Tab Content: Suspension -->
            <div id="tab-suspension" class="tuning-tab-content active">
              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Spring Rate:</span>
                  <span class="slider-val" id="val_frontSpringRate">${t.frontSpringRate||95} N/mm</span>
                </div>
                <input type="range" class="rally-slider" min="50" max="150" step="1" value="${t.frontSpringRate||95}" data-sec="suspension" data-key="frontSpringRate" data-unit="N/mm" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Rear Spring Rate:</span>
                  <span class="slider-val" id="val_rearSpringRate">${t.rearSpringRate||85} N/mm</span>
                </div>
                <input type="range" class="rally-slider" min="45" max="140" step="1" value="${t.rearSpringRate||85}" data-sec="suspension" data-key="rearSpringRate" data-unit="N/mm" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Ride Height:</span>
                  <span class="slider-val" id="val_frontRideHeight">${t.frontRideHeight||140} mm</span>
                </div>
                <input type="range" class="rally-slider" min="90" max="210" step="2" value="${t.frontRideHeight||140}" data-sec="suspension" data-key="frontRideHeight" data-unit="mm" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Rear Ride Height:</span>
                  <span class="slider-val" id="val_rearRideHeight">${t.rearRideHeight||150} mm</span>
                </div>
                <input type="range" class="rally-slider" min="95" max="220" step="2" value="${t.rearRideHeight||150}" data-sec="suspension" data-key="rearRideHeight" data-unit="mm" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Bump Damping:</span>
                  <span class="slider-val" id="val_frontBumpDamping">${t.frontBumpDamping||4200} N·s/m</span>
                </div>
                <input type="range" class="rally-slider" min="2000" max="7000" step="50" value="${t.frontBumpDamping||4200}" data-sec="suspension" data-key="frontBumpDamping" data-unit="N·s/m" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Rebound Damping:</span>
                  <span class="slider-val" id="val_frontReboundDamping">${t.frontReboundDamping||5800} N·s/m</span>
                </div>
                <input type="range" class="rally-slider" min="3000" max="8500" step="50" value="${t.frontReboundDamping||5800}" data-sec="suspension" data-key="frontReboundDamping" data-unit="N·s/m" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Anti-Roll Bar:</span>
                  <span class="slider-val" id="val_frontAntiRollBar">${t.frontAntiRollBar||48} N/mm</span>
                </div>
                <input type="range" class="rally-slider" min="15" max="75" step="1" value="${t.frontAntiRollBar||48}" data-sec="suspension" data-key="frontAntiRollBar" data-unit="N/mm" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Rear Anti-Roll Bar:</span>
                  <span class="slider-val" id="val_rearAntiRollBar">${t.rearAntiRollBar||38} N/mm</span>
                </div>
                <input type="range" class="rally-slider" min="10" max="65" step="1" value="${t.rearAntiRollBar||38}" data-sec="suspension" data-key="rearAntiRollBar" data-unit="N/mm" />
              </div>
            </div>

            <!-- Tab Content: Differential -->
            <div id="tab-diff" class="tuning-tab-content">
              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Accel Lock:</span>
                  <span class="slider-val" id="val_frontAccelLock">${n.frontAccelLock||55}%</span>
                </div>
                <input type="range" class="rally-slider" min="10" max="100" step="1" value="${n.frontAccelLock||55}" data-sec="differential" data-key="frontAccelLock" data-unit="%" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Decel Lock:</span>
                  <span class="slider-val" id="val_frontDecelLock">${n.frontDecelLock||25}%</span>
                </div>
                <input type="range" class="rally-slider" min="5" max="90" step="1" value="${n.frontDecelLock||25}" data-sec="differential" data-key="frontDecelLock" data-unit="%" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Center Torque Split (Front / Rear):</span>
                  <span class="slider-val" id="val_centerTorqueSplitFront">${n.centerTorqueSplitFront||42}% / ${100-(n.centerTorqueSplitFront||42)}%</span>
                </div>
                <input type="range" class="rally-slider" min="20" max="60" step="1" value="${n.centerTorqueSplitFront||42}" data-sec="differential" data-key="centerTorqueSplitFront" data-unit="%" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Rear Accel Lock:</span>
                  <span class="slider-val" id="val_rearAccelLock">${n.rearAccelLock||75}%</span>
                </div>
                <input type="range" class="rally-slider" min="20" max="100" step="1" value="${n.rearAccelLock||75}" data-sec="differential" data-key="rearAccelLock" data-unit="%" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Rear Decel Lock:</span>
                  <span class="slider-val" id="val_rearDecelLock">${n.rearDecelLock||40}%</span>
                </div>
                <input type="range" class="rally-slider" min="10" max="95" step="1" value="${n.rearDecelLock||40}" data-sec="differential" data-key="rearDecelLock" data-unit="%" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Rear Diff Preload:</span>
                  <span class="slider-val" id="val_rearPreloadNm">${n.rearPreloadNm||90} N·m</span>
                </div>
                <input type="range" class="rally-slider" min="20" max="220" step="5" value="${n.rearPreloadNm||90}" data-sec="differential" data-key="rearPreloadNm" data-unit="N·m" />
              </div>
            </div>

            <!-- Tab Content: Transmission & Dyno -->
            <div id="tab-gears" class="tuning-tab-content">
              <div class="slider-group">
                <div class="slider-header">
                  <span>Final Drive Ratio:</span>
                  <span class="slider-val" id="val_finalDriveRatio">${r.finalDriveRatio||4.18}</span>
                </div>
                <input type="range" class="rally-slider" min="3.2" max="5.5" step="0.02" value="${r.finalDriveRatio||4.18}" data-sec="transmission" data-key="finalDriveRatio" data-unit="" />
              </div>

              <div class="dyno-mount-wrapper">
                <canvas id="dynoCanvas" class="dyno-canvas"></canvas>
              </div>

              <div class="gear-sliders-grid">
                ${(r.gearRatios||[3.45,2.38,1.76,1.35,1.08,.89]).map((e,t)=>`
                  <div class="slider-group-small">
                    <span>G${t+1}: <strong id="val_gear_${t}">${e}</strong></span>
                    <input type="range" class="rally-slider-gear" min="0.6" max="4.2" step="0.01" value="${e}" data-gear-idx="${t}" />
                  </div>
                `).join(``)}
              </div>
            </div>

            <!-- Tab Content: Tires & Brakes -->
            <div id="tab-tires" class="tuning-tab-content">
              <div class="form-row">
                <label>Tire Compound Specification</label>
                <select id="selectTireCompound" class="rally-select">
                  <option value="soft_tarmac" ${a.tireCompound===`soft_tarmac`?`selected`:``}>Soft Tarmac (Maximum Asphalt Grip)</option>
                  <option value="hard_tarmac" ${a.tireCompound===`hard_tarmac`?`selected`:``}>Hard Tarmac (Endurance Heat Resistance)</option>
                  <option value="gravel_rough" ${a.tireCompound===`gravel_rough`?`selected`:``}>Rough Gravel (Reinforced Sidewalls)</option>
                  <option value="snow_studded" ${a.tireCompound===`snow_studded`?`selected`:``}>Studded Snow & Ice (Tungsten Studs)</option>
                </select>
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Tire Pressure:</span>
                  <span class="slider-val" id="val_frontTirePressurePsi">${a.frontTirePressurePsi||27.5} psi</span>
                </div>
                <input type="range" class="rally-slider" min="20.0" max="36.0" step="0.5" value="${a.frontTirePressurePsi||27.5}" data-sec="tires_and_brakes" data-key="frontTirePressurePsi" data-unit="psi" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Rear Tire Pressure:</span>
                  <span class="slider-val" id="val_rearTirePressurePsi">${a.rearTirePressurePsi||26} psi</span>
                </div>
                <input type="range" class="rally-slider" min="20.0" max="36.0" step="0.5" value="${a.rearTirePressurePsi||26}" data-sec="tires_and_brakes" data-key="rearTirePressurePsi" data-unit="psi" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Brake Bias:</span>
                  <span class="slider-val" id="val_brakeBiasFrontPercent">${a.brakeBiasFrontPercent||63.5}%</span>
                </div>
                <input type="range" class="rally-slider" min="50.0" max="75.0" step="0.5" value="${a.brakeBiasFrontPercent||63.5}" data-sec="tires_and_brakes" data-key="brakeBiasFrontPercent" data-unit="%" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Max Brake Torque:</span>
                  <span class="slider-val" id="val_maxBrakeTorqueNm">${a.maxBrakeTorqueNm||3800} N·m</span>
                </div>
                <input type="range" class="rally-slider" min="2400" max="5200" step="50" value="${a.maxBrakeTorqueNm||3800}" data-sec="tires_and_brakes" data-key="maxBrakeTorqueNm" data-unit="N·m" />
              </div>
            </div>
          </div>

          <!-- Column 2: Visual Part Customizer Mount -->
          <div id="partCustomizerMount"></div>
        </div>
      </div>
    `}_initSubcomponents(){let e=this.container.querySelector(`#dynoCanvas`);e&&(this.dynoChart=new zl(e),this.dynoChart.updateTuning(i.currentTuning));let t=this.container.querySelector(`#partCustomizerMount`);t&&(this.partCustomizer=new Rl(t))}_bindEvents(){this.container.querySelectorAll(`.subtab-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.subtab;this.container.querySelectorAll(`.subtab-btn`).forEach(e=>e.classList.remove(`active`)),this.container.querySelectorAll(`.tuning-tab-content`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`);let n=this.container.querySelector(`#${t}`);n&&n.classList.add(`active`),t===`tab-gears`&&this.dynoChart&&setTimeout(()=>this.dynoChart.resize(),50)})}),this.container.querySelectorAll(`.preset-pill`).forEach(n=>{n.addEventListener(`click`,()=>{let r=n.dataset.preset;this.container.querySelectorAll(`.preset-pill`).forEach(e=>e.classList.remove(`active`)),n.classList.add(`active`),i.loadTuningPreset(r),this.render(),this._initSubcomponents(),this._bindEvents(),e.emit(t.NOTIFICATION,{title:`Preset Loaded`,message:r.replace(/_/g,` `).toUpperCase()})})}),this.container.querySelectorAll(`.rally-slider`).forEach(e=>{e.addEventListener(`input`,e=>{let t=e.target.dataset.sec,n=e.target.dataset.key,r=e.target.dataset.unit||``,a=parseFloat(e.target.value),o=this.container.querySelector(`#val_${n}`);o&&(o.textContent=n===`centerTorqueSplitFront`?`${a}% / ${100-a}%`:`${a} ${r}`),i.updateTuningParameter(t,n,a),t===`transmission`&&this.dynoChart&&this.dynoChart.updateTuning(i.currentTuning)})}),this.container.querySelectorAll(`.rally-slider-gear`).forEach(e=>{e.addEventListener(`input`,e=>{let t=parseInt(e.target.dataset.gearIdx,10),n=parseFloat(e.target.value),r=this.container.querySelector(`#val_gear_${t}`);r&&(r.textContent=n.toFixed(2));let a=[...i.currentTuning.transmission.gearRatios];a[t]=n,i.updateTuningParameter(`transmission`,`gearRatios`,a),this.dynoChart&&this.dynoChart.updateTuning(i.currentTuning)})});let n=this.container.querySelector(`#selectTireCompound`);n&&n.addEventListener(`change`,e=>{i.updateTuningParameter(`tires_and_brakes`,`tireCompound`,e.target.value)});let r=this.container.querySelector(`#btnExportTuningJson`);r&&r.addEventListener(`click`,()=>{let n=i.exportTuningSchemaJson(),r=new Blob([n],{type:`application/json`}),a=URL.createObjectURL(r),o=document.createElement(`a`);o.href=a,o.download=`vehicle_tuning_schema.json`,o.click(),URL.revokeObjectURL(a),e.emit(t.NOTIFICATION,{title:`Exported Schema`,message:`Saved active setup to vehicle_tuning_schema.json`})});let a=this.container.querySelector(`#btnResetDefaults`);a&&a.addEventListener(`click`,()=>{i.loadTuningPreset(`asphalt_monte_carlo`),this.render(),this._initSubcomponents(),this._bindEvents()});let o=this.container.querySelector(`#btnApplyAndDrive`);o&&o.addEventListener(`click`,()=>{i.setActiveTab(`stage_drive`)})}},Vl=class{constructor(e){this.container=e,this.render()}render(){this.container.innerHTML=`
      <div class="suspension-travel-panel glass-hud-subpanel">
        <div class="hud-subpanel-header">
          <span>SUSPENSION TRAVEL</span>
          <span class="hud-unit">4-CORNER (MM)</span>
        </div>
        <div class="suspension-corners-grid">
          <!-- FL -->
          <div class="corner-meter" id="corner_fl">
            <div class="corner-label">FL</div>
            <div class="bar-track">
              <div class="bar-fill" id="bar_fl"></div>
              <div class="bottom-out-marker" id="bump_fl"></div>
            </div>
            <div class="corner-val" id="val_fl">140mm</div>
          </div>

          <!-- FR -->
          <div class="corner-meter" id="corner_fr">
            <div class="corner-label">FR</div>
            <div class="bar-track">
              <div class="bar-fill" id="bar_fr"></div>
              <div class="bottom-out-marker" id="bump_fr"></div>
            </div>
            <div class="corner-val" id="val_fr">140mm</div>
          </div>

          <!-- RL -->
          <div class="corner-meter" id="corner_rl">
            <div class="corner-label">RL</div>
            <div class="bar-track">
              <div class="bar-fill" id="bar_rl"></div>
              <div class="bottom-out-marker" id="bump_rl"></div>
            </div>
            <div class="corner-val" id="val_rl">150mm</div>
          </div>

          <!-- RR -->
          <div class="corner-meter" id="corner_rr">
            <div class="corner-label">RR</div>
            <div class="bar-track">
              <div class="bar-fill" id="bar_rr"></div>
              <div class="bottom-out-marker" id="bump_rr"></div>
            </div>
            <div class="corner-val" id="val_rr">150mm</div>
          </div>
        </div>
      </div>
    `,this.bars={fl:this.container.querySelector(`#bar_fl`),fr:this.container.querySelector(`#bar_fr`),rl:this.container.querySelector(`#bar_rl`),rr:this.container.querySelector(`#bar_rr`)},this.vals={fl:this.container.querySelector(`#val_fl`),fr:this.container.querySelector(`#val_fr`),rl:this.container.querySelector(`#val_rl`),rr:this.container.querySelector(`#val_rr`)},this.bumps={fl:this.container.querySelector(`#bump_fl`),fr:this.container.querySelector(`#bump_fr`),rl:this.container.querySelector(`#bump_rl`),rr:this.container.querySelector(`#bump_rr`)}}update(e){if(e)for(let t of[`fl`,`fr`,`rl`,`rr`]){let n=e[t];if(!n)continue;let r=Math.max(0,Math.min(100,n.compressionPct));this.bars[t]&&(this.bars[t].style.height=`${r}%`,r>88?this.bars[t].style.backgroundColor=`#ff1744`:r>65?this.bars[t].style.backgroundColor=`#ffd600`:this.bars[t].style.backgroundColor=`#00e676`),this.vals[t]&&(this.vals[t].textContent=`${n.travelMm}mm`),this.bumps[t]&&(this.bumps[t].style.opacity=n.bottomedOut?`1`:`0`)}}},Hl=class{constructor(e){this.canvas=e,this.ctx=this.canvas.getContext(`2d`),this.history=[],this.maxHistory=24,this.resize()}resize(){if(!this.canvas)return;let e=this.canvas.clientWidth||140,t=window.devicePixelRatio||1;this.canvas.width=e*t,this.canvas.height=e*t,this.ctx.scale(t,t)}update(e){if(!this.canvas||!this.ctx||!e)return;let t=e.lateralG||0,n=e.longitudinalG||0;this.history.push({latG:t,longG:n}),this.history.length>this.maxHistory&&this.history.shift(),this.render(t,n)}render(e,t){let n=this.canvas.clientWidth||140,r=this.ctx,i=n*.5,a=n*.42;r.clearRect(0,0,n,n),r.lineWidth=1;for(let e=.5;e<=2;e+=.5){let t=e/2*a;r.strokeStyle=e===1?`rgba(255, 255, 255, 0.28)`:`rgba(255, 255, 255, 0.08)`,r.beginPath(),r.arc(i,i,t,0,Math.PI*2),r.stroke()}if(r.strokeStyle=`rgba(255, 255, 255, 0.14)`,r.beginPath(),r.moveTo(i,8),r.lineTo(i,n-8),r.moveTo(8,i),r.lineTo(n-8,i),r.stroke(),this.history.length>1){r.lineWidth=2;for(let e=0;e<this.history.length-1;e++){let t=this.history[e],n=this.history[e+1],o=i+t.latG/2*a,s=i-t.longG/2*a,c=i+n.latG/2*a,l=i-n.longG/2*a;r.strokeStyle=`rgba(0, 229, 255, ${e/this.history.length*.6})`,r.beginPath(),r.moveTo(o,s),r.lineTo(c,l),r.stroke()}}let o=i+e/2*a,s=i-t/2*a,c=Math.hypot(e,t),l=c>1.6?`#ff1744`:c>1.1?`#ffd600`:`#00e5ff`;r.fillStyle=l,r.shadowColor=l,r.shadowBlur=8,r.beginPath(),r.arc(o,s,4.5,0,Math.PI*2),r.fill(),r.shadowBlur=0,r.fillStyle=`#ffffff`,r.font=`bold 9px monospace`,r.textAlign=`center`,r.fillText(`${c.toFixed(2)}G`,i,n-4)}},Ul=class{constructor(e){this.container=e,this.activeNote=null,this.distanceToApex=0,this.initialDistance=120,this.render(),this._bindEvents()}render(){this.container.innerHTML=`
      <div class="co-driver-container" id="coDriverContainer">
        <div class="pacenote-card" id="pacenoteCard" style="display: none;">
          <div class="pacenote-icon-box" id="pacenoteIconBox">
            <svg id="pacenoteSvg" class="pacenote-svg" viewBox="0 0 100 100">
              <!-- Dynamically populated rally arrows -->
            </svg>
          </div>
          <div class="pacenote-details">
            <div class="pacenote-callout" id="pacenoteCallout">Flat Right 150</div>
            <div class="pacenote-detail-sub" id="pacenoteDetailSub">Keep Middle</div>
            <div class="pacenote-countdown-track">
              <div class="pacenote-countdown-fill" id="pacenoteCountdownFill"></div>
            </div>
          </div>
          <div class="pacenote-distance-badge" id="pacenoteDistBadge">120m</div>
        </div>
      </div>
    `,this.card=this.container.querySelector(`#pacenoteCard`),this.iconBox=this.container.querySelector(`#pacenoteIconBox`),this.svg=this.container.querySelector(`#pacenoteSvg`),this.callout=this.container.querySelector(`#pacenoteCallout`),this.detailSub=this.container.querySelector(`#pacenoteDetailSub`),this.countdownFill=this.container.querySelector(`#pacenoteCountdownFill`),this.distBadge=this.container.querySelector(`#pacenoteDistBadge`)}_bindEvents(){e.on(t.PACENOTE_TRIGGER,e=>{this.showPacenote(e)})}showPacenote(e){if(!i.hudSettings.showCoDriver)return;this.activeNote=e,this.initialDistance=100,this.distanceToApex=100,this.card.style.display=`flex`,this.card.classList.add(`note-pop`),setTimeout(()=>this.card.classList.remove(`note-pop`),300),this.callout.textContent=e.call||``,this.detailSub.textContent=e.detail||(e.modifier?`Modifier: ${e.modifier}`:``);let t=e.type===`jump`?`#ffea00`:{1:`#ff1744`,2:`#ff6d00`,3:`#ffd600`,4:`#76ff03`,5:`#00e676`,6:`#00e5ff`}[e.severity]||`#00e676`;this.iconBox.style.backgroundColor=t,this.distBadge.style.borderColor=t,this._renderArrowSvg(e,t)}_renderArrowSvg(e,t){let n=e.direction===`left`,r=e.direction===`right`,i=e.type===`jump`,a=e.type===`hairpin`,o=``;o=i?`
        <path d="M 20 80 Q 50 15 80 80" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round"/>
        <polygon points="50,15 35,40 65,40" fill="#000"/>
      `:a?n?`
          <path d="M 70 85 L 70 45 A 25 25 0 0 0 30 45 L 30 75" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round"/>
          <polygon points="30,85 18,65 42,65" fill="#000"/>
        `:`
          <path d="M 30 85 L 30 45 A 25 25 0 0 1 70 45 L 70 75" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round"/>
          <polygon points="70,85 58,65 82,65" fill="#000"/>
        `:n?`
        <path d="M 75 85 Q 75 35 30 35" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round"/>
        <polygon points="15,35 38,20 38,50" fill="#000"/>
      `:r?`
        <path d="M 25 85 Q 25 35 70 35" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round"/>
        <polygon points="85,35 62,20 62,50" fill="#000"/>
      `:`
        <line x1="50" y1="85" x2="50" y2="25" stroke="#000" stroke-width="12" stroke-linecap="round"/>
        <polygon points="50,12 32,35 68,35" fill="#000"/>
      `,this.svg.innerHTML=o}update(e){if(!this.activeNote||!this.card)return;let t=e?.stageProgress?.currentDistanceM||0,n=Math.max(0,this.activeNote.distance-t);if(n<=0){this.card.style.opacity=`0`,setTimeout(()=>{this.card.style.opacity===`0`&&(this.card.style.display=`none`,this.card.style.opacity=`1`)},500),this.activeNote=null;return}this.distBadge.textContent=`${Math.round(n)}m`;let r=Math.min(1,n/this.initialDistance);this.countdownFill.style.width=`${r*100}%`}},Wl=class{constructor(e){this.container=e,this.suspensionMeter=null,this.gForceMeter=null,this.coDriver=null,this.render(),this._initSubmeters(),this._bindEvents()}render(){this.container.innerHTML=`
      <div class="telemetry-hud-root" id="telemetryHudRoot">
        <!-- Top: AI Co-Driver Overlay Mount -->
        <div id="coDriverMount" class="hud-top-center"></div>

        <!-- Top Left: Stage Progress & Split Timer -->
        <div class="stage-progress-panel glass-hud-subpanel">
          <div class="stage-name-label" id="hudStageName">Col de Turini - Alpine Switchbacks</div>
          <div class="stage-time-display">
            <span class="timer-icon">⏱️</span>
            <span id="hudTimer">00:00.0</span>
          </div>
          <div class="stage-bar-track">
            <div class="stage-bar-fill" id="hudStageBar"></div>
          </div>
          <div class="stage-dist-row">
            <span id="hudCurrentDist">0.0 km</span>
            <span id="hudTotalDist">4.2 km</span>
          </div>
        </div>

        <!-- Top Right: Telemetry Controls & Camera Mode Pill -->
        <div class="hud-top-right">
          <div class="camera-mode-pill" id="hudCameraPill">CAM: CHASE</div>
          <button class="hud-icon-btn" id="btnToggleHud" title="Toggle HUD (T)">📊 HUD</button>
        </div>

        <!-- Bottom Left: 4-Corner Tire Heatmap & Suspension -->
        <div class="telemetry-corner-cluster glass-hud-panel" id="telemetryLeftCluster">
          <!-- Suspension 4-Corner Mount -->
          <div id="suspensionMount"></div>

          <!-- Tire Thermal Heatmap -->
          <div class="tire-thermal-panel glass-hud-subpanel">
            <div class="hud-subpanel-header">
              <span>TIRE CORE & SURFACE TEMPS</span>
              <span class="hud-unit">°C / PSI</span>
            </div>
            <div class="tire-grid">
              <div class="tire-cell" id="tire_fl">
                <div class="tire-id">FL</div>
                <div class="tire-temp" id="temp_fl">84°C</div>
                <div class="tire-psi" id="psi_fl">27.5 psi</div>
                <div class="tire-slip" id="slip_fl">Slip: 0°</div>
              </div>
              <div class="tire-cell" id="tire_fr">
                <div class="tire-id">FR</div>
                <div class="tire-temp" id="temp_fr">84°C</div>
                <div class="tire-psi" id="psi_fr">27.5 psi</div>
                <div class="tire-slip" id="slip_fr">Slip: 0°</div>
              </div>
              <div class="tire-cell" id="tire_rl">
                <div class="tire-id">RL</div>
                <div class="tire-temp" id="temp_rl">82°C</div>
                <div class="tire-psi" id="psi_rl">26.0 psi</div>
                <div class="tire-slip" id="slip_rl">Slip: 0°</div>
              </div>
              <div class="tire-cell" id="tire_rr">
                <div class="tire-id">RR</div>
                <div class="tire-temp" id="temp_rr">82°C</div>
                <div class="tire-psi" id="psi_rr">26.0 psi</div>
                <div class="tire-slip" id="slip_rr">Slip: 0°</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Right: Dashboard Cluster (Speed, RPM, Gear, Boost, G-Meter) -->
        <div class="telemetry-dash-cluster glass-hud-panel" id="telemetryRightCluster">
          <!-- G-Force Meter Mount -->
          <div class="g-meter-subpanel glass-hud-subpanel">
            <div class="hud-subpanel-header">
              <span>G-FORCE FRICTION</span>
            </div>
            <canvas id="gForceCanvas" class="g-force-canvas"></canvas>
          </div>

          <!-- Turbo Boost Gauge -->
          <div class="boost-subpanel glass-hud-subpanel">
            <div class="hud-subpanel-header">
              <span>TURBO BOOST</span>
              <span class="hud-unit">BAR</span>
            </div>
            <div class="boost-gauge-visual">
              <div class="boost-arc-track">
                <div class="boost-needle" id="boostNeedle"></div>
              </div>
              <div class="boost-digital-val">
                <span id="val_boost">0.00</span>
                <span class="unit">BAR</span>
              </div>
              <div class="boost-peak" id="val_peak_boost">PEAK: 2.45</div>
            </div>
          </div>

          <!-- Master Speedo & Tacho Cluster -->
          <div class="master-cluster glass-hud-subpanel">
            <!-- Shift LED Lights -->
            <div class="shift-lights-row" id="shiftLightsRow">
              <div class="shift-led green"></div>
              <div class="shift-led green"></div>
              <div class="shift-led yellow"></div>
              <div class="shift-led yellow"></div>
              <div class="shift-led red"></div>
              <div class="shift-led red flash"></div>
            </div>

            <!-- Big Gear & Speed Row -->
            <div class="cluster-main-row">
              <div class="gear-display-box">
                <span class="gear-label">GEAR</span>
                <span class="gear-val" id="hudGearVal">1</span>
              </div>
              <div class="speed-display-box">
                <span class="speed-val" id="hudSpeedVal">0</span>
                <span class="speed-unit">KM/H</span>
              </div>
            </div>

            <!-- RPM Progress Arc -->
            <div class="rpm-bar-container">
              <div class="rpm-bar-fill" id="hudRpmFill"></div>
              <div class="rpm-text-row">
                <span>0</span>
                <span id="hudRpmText">1200 RPM</span>
                <span class="redline">8.4k</span>
              </div>
            </div>

            <!-- Pedals Inputs -->
            <div class="pedal-inputs-row">
              <div class="pedal-bar throttle" title="Throttle"><div id="pedal_thr"></div></div>
              <div class="pedal-bar brake" title="Brake"><div id="pedal_brk"></div></div>
              <div class="pedal-bar handbrake" title="Handbrake"><div id="pedal_hb"></div></div>
            </div>
          </div>
        </div>

        <!-- Hotkey Tips Bar -->
        <div class="hotkey-tips-bar">
          <span>🎮 <strong>W/S</strong>: Throttle/Brake</span>
          <span><strong>A/D</strong>: Steer</span>
          <span><strong>SPACE</strong>: Handbrake</span>
          <span><strong>Q/E</strong>: Gear Shift</span>
          <span><strong>C</strong>: Cam Mode</span>
          <span><strong>T</strong>: Toggle HUD</span>
          <span><strong>R</strong>: Reset Track</span>
        </div>
      </div>
    `}_initSubmeters(){let e=this.container.querySelector(`#suspensionMount`);e&&(this.suspensionMeter=new Vl(e));let t=this.container.querySelector(`#gForceCanvas`);t&&(this.gForceMeter=new Hl(t));let n=this.container.querySelector(`#coDriverMount`);n&&(this.coDriver=new Ul(n))}_bindEvents(){e.on(t.TELEMETRY_UPDATE,e=>{this.update(e)}),e.on(t.CAMERA_VIEW_CHANGED,({mode:e})=>{let t=this.container.querySelector(`#hudCameraPill`);t&&(t.textContent=`CAM: ${e.toUpperCase()}`)}),e.on(t.STAGE_SELECTED,({stage:e})=>{let t=this.container.querySelector(`#hudStageName`);t&&(t.textContent=e.name)});let n=this.container.querySelector(`#btnToggleHud`);n&&n.addEventListener(`click`,()=>{i.hudSettings.showTelemetry=!i.hudSettings.showTelemetry,this.setVisibility(i.hudSettings.showTelemetry)}),e.on(t.HUD_VISIBILITY_TOGGLED,({showTelemetry:e})=>{this.setVisibility(e)})}setVisibility(e){let t=this.container.querySelector(`#telemetryLeftCluster`),n=this.container.querySelector(`#telemetryRightCluster`);t&&(t.style.display=e?`flex`:`none`),n&&(n.style.display=e?`flex`:`none`)}update(e){if(!e)return;let{vehicle:t,suspension:n,tires:r,gForces:i,stageProgress:a}=e;this.suspensionMeter&&this.suspensionMeter.update(n),this.gForceMeter&&this.gForceMeter.update(i),this.coDriver&&this.coDriver.update(e);let o=this.container.querySelector(`#hudGearVal`);o&&(o.textContent=t.gear===0?`N`:t.gear===-1?`R`:t.gear);let s=this.container.querySelector(`#hudSpeedVal`);s&&(s.textContent=Math.round(t.speedKph));let c=this.container.querySelector(`#hudRpmFill`),l=this.container.querySelector(`#hudRpmText`);if(c&&l){let e=t.engineRpm||1200,n=Math.min(100,Math.round(e/8400*100));c.style.width=`${n}%`,l.textContent=`${e} RPM`,e>7800?c.style.backgroundColor=`#ff1744`:e>6500?c.style.backgroundColor=`#ffd600`:c.style.backgroundColor=`#00e676`}let u=this.container.querySelectorAll(`.shift-led`),d=t.engineRpm||1200;u.forEach((e,t)=>{let n=5500+t*450;d>=n?e.classList.add(`lit`):e.classList.remove(`lit`)});let f=this.container.querySelector(`#boostNeedle`),p=this.container.querySelector(`#val_boost`),m=this.container.querySelector(`#val_peak_boost`);if(p&&(p.textContent=t.turboBoostBar.toFixed(2)),m&&(m.textContent=`PEAK: ${t.peakBoostBar.toFixed(2)}`),f){let e=-90+t.turboBoostBar/3*180;f.style.transform=`rotate(${e}deg)`}let h=this.container.querySelector(`#pedal_thr`),g=this.container.querySelector(`#pedal_brk`),_=this.container.querySelector(`#pedal_hb`);h&&(h.style.height=`${t.throttle*100}%`),g&&(g.style.height=`${t.brake*100}%`),_&&(_.style.height=`${t.handbrake*100}%`);for(let e of[`fl`,`fr`,`rl`,`rr`]){let t=r[e];if(!t)continue;let n=this.container.querySelector(`#tire_${e}`),i=this.container.querySelector(`#temp_${e}`),a=this.container.querySelector(`#psi_${e}`),o=this.container.querySelector(`#slip_${e}`);i&&(i.textContent=`${Math.round(t.surfaceTempC)}°C`),a&&(a.textContent=`${t.pressurePsi} psi`),o&&(o.textContent=`Slip: ${t.slipAngleDeg}°`),n&&(t.surfaceTempC<65?n.style.borderColor=`#29b6f6`:t.surfaceTempC<=95?n.style.borderColor=`#00e676`:t.surfaceTempC<=110?n.style.borderColor=`#ffd600`:n.style.borderColor=`#ff1744`)}if(a){let e=this.container.querySelector(`#hudCurrentDist`),t=this.container.querySelector(`#hudTotalDist`),n=this.container.querySelector(`#hudStageBar`),r=this.container.querySelector(`#hudTimer`);if(e&&(e.textContent=`${(a.currentDistanceM/1e3).toFixed(2)} km`),t&&(t.textContent=`${(a.totalDistanceM/1e3).toFixed(2)} km`),n&&(n.style.width=`${a.progressPercent}%`),r&&a.elapsedTimeSec!==void 0){let e=Math.floor(a.elapsedTimeSec/60),t=(a.elapsedTimeSec%60).toFixed(1);r.textContent=`${e.toString().padStart(2,`0`)}:${t.padStart(4,`0`)}`}}}},Gl=9.80665,Kl=101325,ql=287.05,Jl=1.4,Yl=1004.7,Xl=1.33,Zl=1150,Ql=43e6,$l=273.15,eu=Math.PI*2,tu=Math.PI/30,nu=30/Math.PI,ru=Math.PI/180,iu=6378137,au=.0066943799901413165,X=(e,t,n)=>e<t?t:e>n?n:e,Z=e=>e<0?0:e>1?1:e,ou=e=>e*180/Math.PI;function su(e,t,n){if(t===e)return+(n>=t);let r=Z((n-e)/(t-e));return r*r*(3-2*r)}function cu(e,t,n,r){return n<=0?t:t+(e-t)*Math.exp(-r/n)}function lu(e,t,n){let r=t-e;return r>n?e+n:r<-n?e-n:t}function uu(e,t=2166136261){let n=t>>>0;for(let t=0;t<e.length;t++)n^=e.charCodeAt(t),n=Math.imul(n,16777619)>>>0;return n>>>0}function du(e){let t=uu(e),n=uu(e,2538058380);return t.toString(16).padStart(8,`0`)+n.toString(16).padStart(8,`0`)}var fu=class{constructor(e){this.defs=e.surfaces;for(let[e,t]of Object.entries(this.defs)){for(let n of[`category`,`friction`,`slideRatio`,`stiffness`,`rollingResistance`])if(t[n]===void 0)throw RangeError(`surfaces.${e}.${n} is required`);if(!(t.friction>0))throw RangeError(`surfaces.${e}.friction must be > 0`)}this.categories=e.categories??[`tarmac`,`wet_tarmac`,`dirt`,`gravel`,`mud`,`snow`,`ice`]}has(e){return Object.prototype.hasOwnProperty.call(this.defs,e)}def(e){let t=this.defs[e];if(!t)throw RangeError(`unknown surface type "${e}"`);return t}resolve(e,t,n,r={}){let i=1,a=0,o=0,s=0,c=0,l=0,u=0,d=0,f=0,p=0,m=-1,h=e[e.length-1].type,g=0,_=0;for(let r=0;r<e.length;r++){let v=e[r],y=this.def(v.type),b=r===e.length-1,x;if(b)x=i;else{let e=v.depth??0;if(e<=0)continue;let t=Math.max(y.penetrationDepth??.03,1e-4);x=i*(1-Math.exp(-e/t)),g+=(y.depthResistance??0)*Math.min(e+1.5*(v.sinkage??0),.2),_+=e}i-=x;let S=t[y.category]??1;a+=x*y.friction*S,o+=x*y.slideRatio,s+=x*y.stiffness,c+=x*y.rollingResistance,l+=x*(y.heatTransfer??1),u+=x*(y.abrasiveness??1),d+=x*(y.pressureSensitivity??0),p+=x*(y.roughness??0);let C=Math.min(n+(y.roadTempOffsetK??0),y.roadTempCapK??1/0);f+=x*C,x>m&&(m=x,h=v.type)}return r.friction=a,r.slideRatio=X(o,.5,1),r.stiffness=s,r.rollingResistance=c+g,r.heatTransfer=l,r.abrasiveness=u,r.pressureSensitivity=d,r.roadTempK=f,r.roughness=p,r.dominant=h,r.looseDepth=_,r}},pu=class{get envelope(){return!1}constructor({height:e=0,layers:t=[{type:`tarmac`}]}={}){this.height=e,this.layers=t}sample(){return{height:this.height,nx:0,ny:1,nz:0,layers:this.layers}}};function mu(e){return e===null?`null`:Array.isArray(e)?`array`:Number.isInteger(e)?`integer`:typeof e}function hu(e,t){let n=mu(e);return t===`number`?n===`number`||n===`integer`:n===t}function gu(e,t){if(!t.startsWith(`#/`))throw Error(`unsupported $ref "${t}" (only local refs)`);let n=e;for(let e of t.slice(2).split(`/`))if(n=n?.[e.replace(/~1/g,`/`).replace(/~0/g,`~`)],n===void 0)throw Error(`unresolvable $ref "${t}"`);return n}function _u(e,t,n=e,r=`$`,i=[]){if(e.$ref)return _u(gu(n,e.$ref),t,n,r,i);if(e.type!==void 0){let n=Array.isArray(e.type)?e.type:[e.type];if(!n.some(e=>hu(t,e)))return i.push({path:r,message:`expected ${n.join(` | `)}, got ${mu(t)}`}),i}if(e.const!==void 0&&t!==e.const&&i.push({path:r,message:`must equal ${JSON.stringify(e.const)}`}),e.enum&&!e.enum.includes(t)&&i.push({path:r,message:`must be one of ${JSON.stringify(e.enum)}`}),typeof t==`number`&&(Number.isFinite(t)||i.push({path:r,message:`must be finite`}),e.minimum!==void 0&&t<e.minimum&&i.push({path:r,message:`must be >= ${e.minimum}`}),e.maximum!==void 0&&t>e.maximum&&i.push({path:r,message:`must be <= ${e.maximum}`}),e.exclusiveMinimum!==void 0&&t<=e.exclusiveMinimum&&i.push({path:r,message:`must be > ${e.exclusiveMinimum}`}),e.exclusiveMaximum!==void 0&&t>=e.exclusiveMaximum&&i.push({path:r,message:`must be < ${e.exclusiveMaximum}`})),typeof t==`string`&&(e.minLength!==void 0&&t.length<e.minLength&&i.push({path:r,message:`length must be >= ${e.minLength}`}),e.pattern&&!new RegExp(e.pattern).test(t)&&i.push({path:r,message:`must match /${e.pattern}/`})),Array.isArray(t)&&(e.minItems!==void 0&&t.length<e.minItems&&i.push({path:r,message:`needs at least ${e.minItems} items (has ${t.length})`}),e.maxItems!==void 0&&t.length>e.maxItems&&i.push({path:r,message:`allows at most ${e.maxItems} items (has ${t.length})`}),e.items)){let a=0;for(let o=0;o<t.length&&a<5;o++){let s=i.length;_u(e.items,t[o],n,`${r}[${o}]`,i),i.length>s&&a++}}if(typeof t==`object`&&t&&!Array.isArray(t)){for(let n of e.required??[])n in t||i.push({path:`${r}.${n}`,message:`is required`});let a=e.properties??{};for(let[e,o]of Object.entries(a))e in t&&_u(o,t[e],n,`${r}.${e}`,i);if(e.additionalProperties!==void 0)for(let o of Object.keys(t))o in a||(e.additionalProperties===!1?i.push({path:`${r}.${o}`,message:`is not allowed`}):typeof e.additionalProperties==`object`&&_u(e.additionalProperties,t[o],n,`${r}.${o}`,i))}for(let a of e.allOf??[])_u(a,t,n,r,i);if(e.anyOf&&!e.anyOf.some(e=>_u(e,t,n,r,[]).length===0)&&i.push({path:r,message:`does not match any allowed shape`}),e.oneOf){let a=e.oneOf.filter(e=>_u(e,t,n,r,[]).length===0).length;a!==1&&i.push({path:r,message:`must match exactly one allowed shape (matches ${a})`})}return i}function vu(e,t,n=0){let r=e*ru,i=t*ru,a=Math.sin(r),o=Math.cos(r),s=iu/Math.sqrt(1-au*a*a);return{x:(s+n)*o*Math.cos(i),y:(s+n)*o*Math.sin(i),z:(s*(1-au)+n)*a}}function yu(e,t,n){let r=Math.hypot(e,t),i=Math.atan2(t,e),a=Math.atan2(n,r*(1-au)),o=0;for(let e=0;e<8;e++){let e=Math.sin(a),t=iu/Math.sqrt(1-au*e*e);o=r/Math.cos(a)-t,a=Math.atan2(n,r*(1-au*t/(t+o)))}return{lat:a/ru,lng:i/ru,h:o}}var bu=class{constructor(e,t,n=0){this.lat0=e,this.lng0=t,this.h0=n;let r=e*ru,i=t*ru,a=Math.sin(r),o=Math.cos(r),s=Math.sin(i),c=Math.cos(i);this.east={x:-s,y:c,z:0},this.north={x:-a*c,y:-a*s,z:o},this.up={x:o*c,y:o*s,z:a},this.origin=vu(e,t,n)}toLocal(e,t,n=0){let r=vu(e,t,n),i=r.x-this.origin.x,a=r.y-this.origin.y,o=r.z-this.origin.z,s=i*this.east.x+a*this.east.y+o*this.east.z,c=i*this.north.x+a*this.north.y+o*this.north.z;return{x:s,y:i*this.up.x+a*this.up.y+o*this.up.z,z:-c}}toGeodetic(e){let t=e.x,n=e.y,r=-e.z;return yu(this.origin.x+t*this.east.x+r*this.north.x+n*this.up.x,this.origin.y+t*this.east.y+r*this.north.y+n*this.up.y,this.origin.z+t*this.east.z+r*this.north.z+n*this.up.z)}},xu=class extends Error{constructor(e){super(`Invalid stage definition:\n${e.map(e=>`  ${e.path}: ${e.message}`).join(`
`)}`),this.name=`StageSchemaError`,this.errors=e}},Su={road:{defaultWidth:6,crownSlope:.025,shoulderWidth:1.5,shoulderLayers:[{type:`gravel`,depth:.015},{type:`packed_dirt`}],verge:{slope:-.35,width:6,layers:[{type:`grass`}]},defaultLayers:[{type:`gravel`,depth:.04},{type:`packed_dirt`}]},processing:{sampleSpacing:1,horizontalSmoothing:0,elevationSmoothing:6,curvatureSmoothing:5,verticalCurvatureSmoothing:9,apexCurvatureSmoothing:8,designSpeed:25,bankFraction:.35,maxBankDeg:8,bankNoiseDeg:1.2,bankNoiseWavelength:90},pacenotes:{mode:`auto`,severityScale:`six_easiest`,leadTimeSeconds:5,minLeadDistance:60,speechRate:3,notes:[]}};function Cu(e,t,n={}){if(!t)throw TypeError(`parseStage needs the parsed gps_stage_schema.json`);let r=e;if(typeof e==`string`)try{r=JSON.parse(e)}catch(e){throw new xu([{path:`$`,message:`not valid JSON (${e.message})`}])}let i=_u(t,r);if(i.length)throw new xu(i);let a=r.track,o=a.lat.length,s=[];for(let e of[`lng`,`elevation`,`width`,`bank`])a[e]&&a[e].length!==o&&s.push({path:`$.track.${e}`,message:`length ${a[e].length} must equal lat length ${o}`});if(s.length)throw new xu(s);let c=r.origin??{lat:a.lat[0],lng:a.lng[0],elevation:a.elevation[0]},l=new bu(c.lat,c.lng,c.elevation??a.elevation[0]),u={...Su.road,...r.road??{},verge:{...Su.road.verge,...r.road?.verge??{}}},d={...Su.processing,...r.processing??{}},f={...Su.pacenotes,...r.pacenotes??{}},p=[];for(let e=0;e<o;e++){let t=l.toLocal(a.lat[e],a.lng[e],a.elevation[e]),n=p[p.length-1];n&&Math.hypot(t.x-n.x,t.z-n.z,t.y-n.y)<.05||p.push({x:t.x,y:t.y,z:t.z,width:a.width?a.width[e]:u.defaultWidth,bank:a.bank?a.bank[e]:null})}if(p.length<4)throw new xu([{path:`$.track`,message:`needs at least 4 distinct points`}]);let m=[],h=(r.surfaces??[]).slice().sort((e,t)=>e.fromDistance-t.fromDistance);if(h.forEach((e,t)=>{e.toDistance>e.fromDistance||m.push({path:`$.surfaces[${t}]`,message:`toDistance must be greater than fromDistance`}),t>0&&e.fromDistance<h[t-1].toDistance-1e-6&&m.push({path:`$.surfaces[${t}]`,message:`overlaps the previous segment`})}),n.surfaces){let e=(e,t)=>e.forEach((e,r)=>{n.surfaces.has(e.type)||m.push({path:`${t}[${r}].type`,message:`unknown surface type "${e.type}"`})});h.forEach((t,n)=>e(t.layers,`$.surfaces[${n}].layers`)),e(u.defaultLayers,`$.road.defaultLayers`),e(u.shoulderLayers,`$.road.shoulderLayers`),e(u.verge.layers,`$.road.verge.layers`)}for(let[e,t]of[[`$.road.defaultLayers`,u.defaultLayers],[`$.road.shoulderLayers`,u.shoulderLayers],[`$.road.verge.layers`,u.verge.layers],...h.map((e,t)=>[`$.surfaces[${t}].layers`,e.layers])])t.slice(0,-1).some(e=>!(e.depth>0))&&m.push({path:e,message:`every layer except the last (base) needs depth > 0`});if(m.length)throw new xu(m);return{id:r.id,name:r.name,country:r.country??``,seed:r.seed??1,frame:l,origin:c,closed:!!a.closed,points:p,road:u,processing:d,pacenotes:f,surfaceSegments:h,checkpoints:(r.checkpoints??[]).slice().sort((e,t)=>e.distance-t.distance)}}var wu=class{constructor(e=1){this.state=e>>>0||2654435769}next(){let e=this.state=this.state+1831565813>>>0;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}range(e,t){return e+(t-e)*this.next()}int(e){return Math.floor(this.next()*e)}gaussian(){let e=Math.max(this.next(),1e-12),t=this.next();return Math.sqrt(-2*Math.log(e))*Math.cos(2*Math.PI*t)}getState(){return this.state}setState(e){this.state=e>>>0}};function Tu(e,t,n=0){let r=Math.imul(e|0,374761393)+Math.imul(t|0,668265263)+Math.imul(n|0,2147483647)|0;return r=Math.imul(r^r>>>13,1274126177),r^=r>>>16,(r>>>0)/4294967296}function Eu(e,t=0){let n=Math.floor(e),r=e-n,i=r*r*r*(r*(r*6-15)+10),a=Tu(n,0,t)*2-1;return a+(Tu(n+1,0,t)*2-1-a)*i}function Du(e,t=0,n=3,r=2,i=.5){let a=1,o=1,s=0,c=0;for(let l=0;l<n;l++)s+=a*Eu(e*o,t+l*101),c+=a,a*=i,o*=r;return s/c}function Ou(e,t,n,r,i,a){let o=.5,s=Math.max(Math.hypot(t.x-e.x,t.y-e.y,t.z-e.z)**o,1e-6),c=Math.max(Math.hypot(n.x-t.x,n.y-t.y,n.z-t.z)**o,1e-6),l=Math.max(Math.hypot(r.x-n.x,r.y-n.y,r.z-n.z)**o,1e-6),u=s,d=u+c,f=d+l,p=u+(d-u)*i;for(let i of[`x`,`y`,`z`]){let o=((u-p)*e[i]+(p-0)*t[i])/(u-0),s=((d-p)*t[i]+(p-u)*n[i])/(d-u),c=((f-p)*n[i]+(p-d)*r[i])/(f-d),l=((d-p)*o+(p-0)*s)/(d-0),m=((f-p)*s+(p-u)*c)/(f-u);a[i]=((d-p)*l+(p-u)*m)/(d-u)}return a}function ku(e,t,n=!1){if(!(t>.3))return Float64Array.from(e);let r=e.length,i=Math.ceil(t*3),a=new Float64Array(2*i+1);for(let e=-i;e<=i;e++)a[e+i]=Math.exp(-(e*e)/(2*t*t));let o=new Float64Array(r);for(let t=0;t<r;t++){let s=0,c=0;for(let o=-i;o<=i;o++){let l=t+o;if(n)l=(l%r+r)%r;else if(l<0||l>=r)continue;s+=a[o+i]*e[l],c+=a[o+i]}o[t]=s/c}return o}var Au=class e{static build(t){let n=t.points,r=t.processing,i=t.closed,a=n.length,o=i?a:a-1,s=e=>i?n[(e%a+a)%a]:e<0?{x:2*n[0].x-n[1].x,y:2*n[0].y-n[1].y,z:2*n[0].z-n[1].z}:e>=a?{x:2*n[a-1].x-n[a-2].x,y:2*n[a-1].y-n[a-2].y,z:2*n[a-1].z-n[a-2].z}:n[e],c=[],l=[],u=[],d=[],f=[],p={x:0,y:0,z:0};for(let e=0;e<o;e++){let t=s(e),r=s(e+1),m=Math.hypot(r.x-t.x,r.y-t.y,r.z-t.z),h=X(Math.ceil(m/.4),4,4e3),g=e===o-1,_=n[(e%a+a)%a],v=n[((e+1)%a+a)%a];for(let n=0;n<h+(g&&!i?1:0);n++){let i=n/h;Ou(s(e-1),t,r,s(e+2),i,p),c.push(p.x),l.push(p.y),u.push(p.z),d.push(_.width+(v.width-_.width)*i),f.push(_.bank===null?NaN:_.bank+(v.bank-_.bank)*i)}}i&&(c.push(c[0]),l.push(l[0]),u.push(u[0]),d.push(d[0]),f.push(f[0]));let m=c.length,h=new Float64Array(m);for(let e=1;e<m;e++)h[e]=h[e-1]+Math.hypot(c[e]-c[e-1],l[e]-l[e-1],u[e]-u[e-1]);let g=h[m-1],_=r.sampleSpacing,v=Math.max(8,Math.round(g/_)+1),y=g/(v-1),b=new Float64Array(v),x=new Float64Array(v),S=new Float64Array(v),C=new Float64Array(v),w=new Float64Array(v),T=0;for(let e=0;e<v;e++){let t=e*y;for(;T<m-2&&h[T+1]<t;)T++;let n=h[T+1]-h[T],r=n>1e-12?(t-h[T])/n:0;b[e]=c[T]+(c[T+1]-c[T])*r,x[e]=l[T]+(l[T+1]-l[T])*r,S[e]=u[T]+(u[T+1]-u[T])*r,C[e]=d[T]+(d[T+1]-d[T])*r,w[e]=f[T]+(f[T+1]-f[T])*r}let E=y;b=ku(b,r.horizontalSmoothing/E,i),S=ku(S,r.horizontalSmoothing/E,i),x=ku(x,r.elevationSmoothing/E,i);let D=new Float64Array(v),O=new Float64Array(v);for(let e=1;e<v;e++){let t=b[e]-b[e-1],n=S[e]-S[e-1],r=x[e]-x[e-1];O[e]=O[e-1]+Math.hypot(t,n),D[e]=D[e-1]+Math.hypot(t,r,n)}let k={n:v,closed:i,step:E,length:D[v-1],horizontalLength:O[v-1],s:D,l:O,x:b,y:x,z:S,width:C,tx:new Float64Array(v),tz:new Float64Array(v),rx:new Float64Array(v),rz:new Float64Array(v),heading:new Float64Array(v),kappa:new Float64Array(v),grade:new Float64Array(v),kv:new Float64Array(v),bank:new Float64Array(v),tanBank:new Float64Array(v)};for(let e=0;e<v;e++){let t=i?(e-1+v-1)%(v-1):Math.max(e-1,0),n=i?(e+1)%(v-1):Math.min(e+1,v-1),r=b[n]-b[t],a=S[n]-S[t];i&&e===v-1&&(r=b[1]-b[v-2],a=S[1]-S[v-2]);let o=Math.hypot(r,a)||1;k.tx[e]=r/o,k.tz[e]=a/o,k.rx[e]=-k.tz[e],k.rz[e]=k.tx[e],k.heading[e]=Math.atan2(k.tx[e],-k.tz[e])}for(let e=1;e<v;e++){let t=k.heading[e]-k.heading[e-1];for(;t>Math.PI;)k.heading[e]-=2*Math.PI,t-=2*Math.PI;for(;t<-Math.PI;)k.heading[e]+=2*Math.PI,t+=2*Math.PI}let A=new Float64Array(v);for(let e=0;e<v;e++){let t=Math.max(e-1,0),n=Math.min(e+1,v-1),r=O[n]-O[t];A[e]=r>1e-9?-(k.heading[n]-k.heading[t])/r:0}k.kappa=ku(A,r.curvatureSmoothing/E);for(let e=0;e<v;e++){let t=Math.max(e-1,0),n=Math.min(e+1,v-1),r=O[n]-O[t];k.grade[e]=r>1e-9?(x[n]-x[t])/r:0}let j=ku(x,r.verticalCurvatureSmoothing/E);for(let e=0;e<v;e++){let t=Math.max(e-1,0),n=Math.min(e+1,v-1),r=Math.max(t-1,0),i=Math.min(n+1,v-1),a=O[i]-O[r],o=(j[t]-j[r])/Math.max(O[t]-O[r],1e-9),s=(j[i]-j[n])/Math.max(O[i]-O[n],1e-9);k.kv[e]=a>1e-9?(s-o)/a:0}k.yTrend=ku(x,60/E),k.ySmooth=j,k.kappaRobust=ku(A,r.apexCurvatureSmoothing/E);let M=!Number.isNaN(w[0]),N=t.seed??1,P=new Float64Array(v),ee=r.maxBankDeg*Math.PI/180;for(let e=0;e<v;e++){if(M){P[e]=w[e]*Math.PI/180;continue}let t=k.kappa[e],n=Math.min(ee,Math.atan(r.bankFraction*Math.abs(t)*r.designSpeed*r.designSpeed/Gl)),i=r.bankNoiseDeg*Math.PI/180*Du(D[e]/r.bankNoiseWavelength,N,3);P[e]=-Math.sign(t)*n+i}k.bank=M?P:ku(P,8/E);for(let e=0;e<v;e++)k.tanBank[e]=Math.tan(k.bank[e]);return new e(k,t)}constructor(e,t){Object.assign(this,e),this.def=t,this.road=t.road,this._buildGrid(25)}_buildGrid(e){this.cell=e,this.grid=new Map;for(let t=0;t<this.n;t++){let n=this._key(Math.floor(this.x[t]/e),Math.floor(this.z[t]/e)),r=this.grid.get(n);r||this.grid.set(n,r=[]),r.push(t)}}_key(e,t){return e*73856093^t*19349663}locate(e){e=X(e,0,this.length);let t=this.s,n=0,r=this.n-2;for(;n<r;){let i=n+r+1>>1;t[i]<=e?n=i:r=i-1}let i=t[n+1]-t[n];return{i:n,t:i>1e-12?(e-t[n])/i:0}}sampleAt(e){let{i:t,t:n}=this.locate(e);return this._interp(t,n)}_interp(e,t){let n=e+1,r=r=>r[e]+(r[n]-r[e])*t,i=r(this.tx),a=r(this.tz),o=Math.hypot(i,a)||1;i/=o,a/=o;let s=r(this.y),c=this.l[n]-this.l[e];return{s:r(this.s),x:r(this.x),y:s,z:r(this.z),tx:i,tz:a,rx:-a,rz:i,heading:r(this.heading),kappa:r(this.kappa),bank:r(this.bank),tanBank:r(this.tanBank),width:r(this.width),grade:c>1e-9?(this.y[n]-this.y[e])/c:0,dTanBankDl:c>1e-9?(this.tanBank[n]-this.tanBank[e])/c:0,kv:r(this.kv),index:e,t}}nearest(e,t,n){let r=this.cell,i=Math.floor(e/r),a=Math.floor(t/r),o=null,s=1/0;for(let r=1;r<=4&&!o;r++)for(let c=-r;c<=r;c++)for(let l=-r;l<=r;l++){if(r>1&&Math.abs(c)<r&&Math.abs(l)<r)continue;let u=this.grid.get(this._key(i+c,a+l));if(u)for(let r of u)for(let i=r-1;i<=r;i++){if(i<0||i>=this.n-1)continue;let r=this.x[i],a=this.z[i],c=this.x[i+1]-r,l=this.z[i+1]-a,u=c*c+l*l,d=u>1e-12?((e-r)*c+(t-a)*l)/u:0;d=X(d,0,1);let f=r+c*d,p=a+l*d,m=(e-f)**2+(t-p)**2;if(n!==void 0){let e=this.y[i]+(this.y[i+1]-this.y[i])*d,t=Math.abs(n-e);t>3&&(m+=(t-3)**2*4)}m<s&&(s=m,o={seg:i,t:d})}}return o?this._pack(o.seg,o.t,e,t):this._nearestLinear(e,t)}_nearestLinear(e,t){let n=1/0,r=null;for(let i=0;i<this.n-1;i++){let a=this.x[i],o=this.z[i],s=this.x[i+1]-a,c=this.z[i+1]-o,l=s*s+c*c,u=X(l>1e-12?((e-a)*s+(t-o)*c)/l:0,0,1),d=(e-a-s*u)**2+(t-o-c*u)**2;d<n&&(n=d,r={seg:i,t:u})}return this._pack(r.seg,r.t,e,t)}_pack(e,t,n,r){let i=this._interp(e,t),a=(n-i.x)*i.rx+(r-i.z)*i.rz;return{s:i.s,c:a,dist:Math.hypot(n-i.x,r-i.z),frame:i}}pointAt(e,t=0){let n=this.sampleAt(e);return{x:n.x+n.rx*t,y:n.y-t*n.tanBank,z:n.z+n.rz*t,frame:n}}layersAt(e){let t=this.def.surfaceSegments,n=0,r=t.length-1,i=-1;for(;n<=r;){let a=n+r>>1;t[a].fromDistance<=e?(i=a,n=a+1):r=a-1}return i>=0&&e<=t[i].toDistance?t[i].layers:this.road.defaultLayers}buildRoadMesh({lateralSteps:e=8,stride:t=2,includeShoulders:n=!0}={}){let r=this.road,i=[];for(let e=0;e<this.n;e+=t)i.push(e);i[i.length-1]!==this.n-1&&i.push(this.n-1);let a=e+1,o=new Float32Array(i.length*a*3),s=new Float32Array(i.length*a*3),c=new Float32Array(i.length*a*2),l=new Uint32Array((i.length-1)*e*6),u=0,d=0;i.forEach((t,i)=>{let l=this._interp(Math.min(t,this.n-2),+(t>=this.n-1)),f=l.width*.5+(n?r.shoulderWidth:0);for(let n=0;n<a;n++){let i=n/e,a=-f+2*f*i,p=ju(a,l.width,r),m=l.y-a*l.tanBank+p.h;o[u]=l.x+l.rx*a,o[u+1]=m,o[u+2]=l.z+l.rz*a;let h=-l.tanBank+p.dhdc,g=l.grade/Math.max(.2,1-l.kappa*a),_=g*l.tx+h*l.rx,v=g*l.tz+h*l.rz,y=1/Math.sqrt(_*_+1+v*v);s[u]=-_*y,s[u+1]=y,s[u+2]=-v*y,c[d++]=i,c[d++]=this.s[t]/10,u+=3}});let f=0;for(let t=0;t<i.length-1;t++)for(let n=0;n<e;n++){let e=t*a+n,r=e+1,i=e+a,o=i+1;l[f++]=e,l[f++]=i,l[f++]=r,l[f++]=r,l[f++]=i,l[f++]=o}return{positions:o,normals:s,uvs:c,indices:l}}};function ju(e,t,n){let r=t*.5,i=n.crownSlope,a=Math.abs(e),o=e<0?-1:1,s=-i*r;if(a<=r)return{h:-i*e*e/r,dhdc:-2*i*e/r};let c=n.shoulderWidth;if(a<=r+c)return{h:s-2*i*(a-r),dhdc:o*-2*i};let l=s-2*i*c,u=n.verge,d=Math.min(a-r-c,u.width),f=u.slope;return{h:l+f*d,dhdc:a-r-c<u.width?o*f:0}}var Mu=class{constructor(e,t={}){this.spline=e,this.road=e.road,this.evolution=t.evolution??null,this.last={s:0,c:0,onRoad:!0,id:-1}}setEvolution(e){this.evolution=e}sample(e,t,n=0,r){let i=this.spline,a=this.road,o=i.nearest(e,t,r),s=o.frame,c=o.c,l=s.width*.5,u=ju(c,s.width,a),d=s.y-c*s.tanBank+u.h,f=-s.tanBank+u.dhdc,p=(s.grade-c*s.dTanBankDl)/Math.max(.2,1-s.kappa*c),m=Math.abs(c)<=l,h=!m&&Math.abs(c)<=l+a.shoulderWidth,g;g=m?i.layersAt(o.s):h?a.shoulderLayers:a.verge.layers;let _=this.evolution;if(_&&m){let e=_.sample(o.s,c);d-=e.rut,f-=e.drutDc,p-=e.drutDs,g=_.layersAt(g,o.s,c,e)}let v=p*s.tx+f*s.rx,y=p*s.tz+f*s.rz,b=1/Math.sqrt(v*v+1+y*y);return this.last.s=o.s,this.last.c=c,this.last.onRoad=m,this.last.id=n,{height:d,nx:-v*b,ny:b,nz:-y*b,layers:g,s:o.s,c,onRoad:m,width:s.width}}baseHeight(e,t){let n=this.spline.nearest(e,t),r=n.frame;return r.y-n.c*r.tanBank+ju(n.c,r.width,this.road).h}},Nu=[`zero`,`one`,`two`,`three`,`four`,`five`,`six`,`seven`,`eight`,`nine`,`ten`],Pu={enterRadius:250,leaveRadius:400,minAngleDeg:14,tightRadius:70,tightMinAngleDeg:10,crestProminence:1.1,dipProminence:.9,verticalEdgeMargin:15,mergeGap:22,chainGap:45,longLength:75,severityRadii:[110,75,50,32,20],hairpinRadius:17,hairpinAngleDeg:125,squareAngleRange:[75,115],squareRadius:22,tightenRatio:1.45,offCamberDeg:1.8,crestRefSpeed:28,jumpRatio:.8,crestRatio:.38,dipRatio:.45,distanceCallMin:90};function Fu(e,t){let n=t.severityRadii;for(let t=0;t<n.length;t++)if(e>=n[t])return 6-t;return 1}function Iu(e,t){let n=t===`one_easiest`?7-e.severity:e.severity,r=[];e.type===`hairpin`?r.push(`hairpin`,e.direction):e.type===`square`?r.push(`square`,e.direction):r.push(e.direction,Nu[n]);let i={long:[`long`],tightens:[`tightens`],opens:[`opens`],dont_cut:[`don't`,`cut`],off_camber:[`off`,`camber`],over_crest:[`over`,`crest`],caution:[`caution`],into:[]};for(let t of e.modifiers)r.push(...i[t]??[t.replace(/_/g,` `)]);return r}function Lu(e){return e>=1e3?`${Math.round(e/100)/10} k`:String(e)}function Ru(e,t={}){let n={...Pu,...t},r=t.severityScale??`six_easiest`,i=e.n,a=1/n.enterRadius,o=1/n.leaveRadius,s=[],c=null;for(let t=0;t<i;t++){let n=e.kappaRobust[t],r=Math.abs(n);c?Math.sign(n)!==c.sign&&r>=a?(c.i1=t,s.push(c),c={i0:t,sign:Math.sign(n)}):(r<o||Math.sign(n)!==c.sign)&&(c.i1=t,s.push(c),c=null):r>=a&&(c={i0:t,sign:Math.sign(n)})}c&&(c.i1=i-1,s.push(c));let l=[];for(let t of s){let r=l[l.length-1];r&&r.sign===t.sign&&e.s[t.i0]-e.s[r.i1]<n.mergeGap?r.i1=t.i1:l.push({...t})}let u=(t,n)=>{let r=Math.max(0,t-n),a=Math.min(i-1,t+n);return Math.atan2(e.x[a]-e.x[r],-(e.z[a]-e.z[r]))},d=(e,t)=>{let n=t-e;for(;n>Math.PI;)n-=2*Math.PI;for(;n<-Math.PI;)n+=2*Math.PI;return n},f=[];for(let t of l){let r=0;for(let n=t.i0+1;n<=t.i1;n++)r+=e.kappaRobust[n]*(e.l[n]-e.l[n-1]);let a=Math.abs(r)*180/Math.PI,o=e.s[t.i1]-e.s[t.i0],s=X(.3*o,14,50),c=Math.max(2,Math.round(s/e.step)),l=Math.max(2,Math.round(4/e.step)),p=0,m=Math.round((t.i0+t.i1)/2),h=Math.max(t.i0,t.i1-c);for(let n=t.i0;n<=h;n++){let t=Math.min(i-1,n+c),r=e.l[t]-e.l[n];if(r<1e-6)continue;let a=Math.abs(d(u(n,l),u(t,l)))/r;a>p&&(p=a,m=Math.round((n+t)/2))}p===0&&(p=Math.abs(r)/Math.max(o,1));let g=1/Math.max(p,1e-6);if(a<(g<=n.tightRadius?n.tightMinAngleDeg:n.minAngleDeg))continue;let _=Math.min(Math.round(6/e.step),Math.floor((t.i1-t.i0)/6)),v=t.i0+_,y=t.i1-_,b=y-v,x=Math.max(2,Math.floor(b/3)),S=(t,n)=>{let r=e.l[n]-e.l[t];return r>1e-6?Math.abs(d(u(t,l),u(n,l)))/r:0},C=b>=6?S(v,v+x):p,w=b>=6?S(y-x,y):p,T=[],E=`corner`,D=Fu(g,n);g<n.hairpinRadius&&a>n.hairpinAngleDeg?(E=`hairpin`,D=1):a>=n.squareAngleRange[0]&&a<=n.squareAngleRange[1]&&g<n.squareRadius&&(E=`square`,D=1),o>n.longLength&&a>50&&E===`corner`&&T.push(`long`),w>C*n.tightenRatio?T.push(`tightens`):C>w*n.tightenRatio&&T.push(`opens`),e.bank[m]*180/Math.PI*Math.sign(t.sign)>n.offCamberDeg&&D<=4&&T.push(`off_camber`),f.push({type:E,direction:t.sign>0?`left`:`right`,severity:D,angleDeg:a,radius:g,length:o,s:e.s[t.i0],sEnd:e.s[t.i1],sApex:e.s[m],modifiers:T,i0:t.i0,i1:t.i1})}let p=[],m=n.crestRefSpeed*n.crestRefSpeed,h=n.verticalEdgeMargin,g=t=>{let n=e.s[t],r=e.locate(Math.max(0,n-35)).i,i=e.locate(Math.min(e.length,n+35)).i;return e.ySmooth[t]-.5*(e.ySmooth[r]+e.ySmooth[i])},_=0;for(;_<i;){let t=e.kv[_],r=t<0?`crest`:`dip`,a=m*Math.abs(t)/Gl,o=r===`crest`?n.crestRatio:n.dipRatio;if(a>=o){let a=_,s=_;for(;a<i&&Math.sign(e.kv[a])===Math.sign(t)&&m*Math.abs(e.kv[a])/9.80665>=o*.6;)Math.abs(e.kv[a])>Math.abs(e.kv[s])&&(s=a),a++;let c=m*Math.abs(e.kv[s])/Gl,l=g(s),u=r===`crest`?l>=n.crestProminence:-l>=n.dipProminence,d=e.s[s]>h&&e.s[s]<e.length-h;u&&d&&p.push({type:r===`crest`?c>=n.jumpRatio?`jump`:`crest`:`dip`,s:e.s[s],sEnd:e.s[Math.min(a,i-1)],severity:0,direction:``,modifiers:[],ratio:c,prominence:l}),_=a+1}else _++}let v=[];for(let e of p){let t=f.find(t=>e.s>=t.s-15&&e.s<=t.sEnd);t&&e.type===`crest`&&!t.modifiers.includes(`over_crest`)?t.modifiers.push(`over_crest`):v.push(e)}let y=[...f,...v].sort((e,t)=>e.s-t.s);for(let e=0;e<y.length;e++){let t=y[e],r=y[e+1];if(!r)break;if((t.type===`corner`||t.type===`hairpin`||t.type===`square`)&&(r.type===`corner`||r.type===`hairpin`||r.type===`square`)){let e=r.s-t.sEnd;e<n.chainGap&&t.modifiers.push(`into`),e<n.chainGap&&t.severity<=3&&r.direction!==t.direction&&t.modifiers.includes(`caution`)}}return y.forEach((t,i)=>{t.id=`n${i}`;let a=y[i+1],o=a?a.s-t.sEnd:e.length-t.sEnd;t.distanceToNext=Math.max(0,o),t.type===`corner`&&t.severity<=2&&t.modifiers.includes(`tightens`)&&!t.modifiers.includes(`caution`)&&t.modifiers.push(`caution`);let s=t.type===`jump`?[`jump`]:t.type===`crest`?[`crest`]:t.type===`dip`?[`dip`]:Iu(t,r);t.modifiers.includes(`into`)&&a?s.push(`into`):o>=n.distanceCallMin&&a&&s.push(Lu(Math.round(o/10)*10)),t.tokens=s,t.text=s.join(` `),t.priority=t.modifiers.includes(`caution`)||t.type===`jump`||t.type===`hairpin`?2:+(t.severity<=3)}),y}function zu(e,t,n=`six_easiest`){let r=e.slice().sort((e,t)=>e.distance-t.distance).map((e,t)=>{let r=e.type===`left`||e.type===`right`?`corner`:e.type,i={id:`e${t}`,type:r,direction:e.type===`left`||e.type===`right`?e.type:``,severity:typeof e.severity==`number`?e.severity:0,s:e.distance,sEnd:e.distance+10,modifiers:(e.modifiers??[]).slice(),distanceToNext:0,priority:e.priority??1,radius:0,angleDeg:0,length:0};return i.tokens=e.text?e.text.split(/\s+/):r===`corner`?Iu(i,n):[e.type,...i.modifiers],i.text=i.tokens.join(` `),i});return r.forEach((e,n)=>{e.distanceToNext=n+1<r.length?r[n+1].s-e.sEnd:Math.max(0,t.length-e.sEnd)}),r}var Bu=class{constructor(e,t={}){this.notes=e,this.leadTime=t.leadTimeSeconds??5,this.minLead=t.minLeadDistance??60,this.speechRate=t.speechRate??3,this.reset()}reset(){this.next=0,this.queue=[],this.speakingUntil=0,this.time=0,this.current=null,this.missed=0,this.called=0}speechDuration(e){return e.tokens.length/this.speechRate+.25}update(e,t,n){this.time+=e;let r=[],i=Math.max(this.minLead,n*this.leadTime);for(;this.next<this.notes.length&&t>=this.notes[this.next].s-i;)this.queue.push(this.notes[this.next]),this.next++;if(this.queue=this.queue.filter(e=>{let n=t>e.sEnd+5&&e.priority<2;return n&&this.missed++,!n}),this.time>=this.speakingUntil&&this.queue.length){let e=0;for(let t=1;t<this.queue.length;t++){let n=this.queue[t],r=this.queue[e];(n.priority>r.priority||n.priority===r.priority&&n.s<r.s)&&(e=t)}let n=this.queue.splice(e,1)[0],i=this.speechDuration(n);this.speakingUntil=this.time+i,this.current=n,this.called++,r.push({type:`pacenote`,note:n,duration:i,distanceAhead:n.s-t})}else this.time>=this.speakingUntil&&(this.current=null);return r}upcoming(e,t=3){let n=[];for(let r of this.notes)if(r.sEnd>=e&&n.push({id:r.id,text:r.text,distance:r.s-e,note:r}),n.length>=t)break;return n}getState(){return{next:this.next,queue:this.queue.map(e=>e.id),speakingUntil:this.speakingUntil,time:this.time,missed:this.missed,called:this.called,current:this.current?this.current.id:null}}setState(e){let t=new Map(this.notes.map(e=>[e.id,e]));this.next=e.next,this.queue=e.queue.map(e=>t.get(e)),this.speakingUntil=e.speakingUntil,this.time=e.time,this.missed=e.missed,this.called=e.called,this.current=e.current?t.get(e.current):null}},Vu=class e{static fromJson(t,n,r={}){let i=Cu(t,n,r);return new e(i)}constructor(e){this.def=e,this.id=e.id,this.name=e.name,this.frame=e.frame,this.spline=Au.build(e),this.terrain=new Mu(this.spline);let t=e.pacenotes,n=Ru(this.spline,{severityScale:t.severityScale});if(t.mode===`explicit`&&t.notes.length)this.pacenotes=zu(t.notes,this.spline,t.severityScale);else if(t.mode===`merge`&&t.notes.length){let e=zu(t.notes,this.spline,t.severityScale);this.pacenotes=[...n.filter(t=>!e.some(e=>Math.abs(e.s-t.s)<25)),...e].sort((e,t)=>e.s-t.s)}else this.pacenotes=n;this.pacenoteOptions=t}get length(){return this.spline.length}createPacenotePlayer(){return new Bu(this.pacenotes,this.pacenoteOptions)}startPose(e=0,t=0){let n=this.spline.pointAt(e,t);return{x:n.x,y:n.y,z:n.z,heading:n.frame.heading,frame:n.frame}}toGeodetic(e,t=0){let n=this.spline.pointAt(e,t);return this.frame.toGeodetic(n)}},Hu=class{constructor(e,t={}){this.stage=e,this.margin=t.offCourseMargin??4,this.offTime=t.offCourseTime??3,this.checkpoints=e.def.checkpoints,this.reset()}reset(){this.s=0,this.c=0,this.time=0,this.started=!1,this.finished=!1,this.nextCheckpoint=0,this.offCourseTimer=0,this.offCourse=!1,this.splits=[],this.onRoad=!0,this.maxS=0,this.startTime=0,this.finishTime=null}start(){this.started=!0,this.startTime=this.time}update(e,t,n){this.time+=e;let r=[],i=this.stage.spline.nearest(t.x,t.z,n??t.y);this.s=i.s,this.c=i.c,this.maxS=Math.max(this.maxS,i.s);let a=i.frame.width*.5;for(this.onRoad=Math.abs(i.c)<=a,!this.started&&this.s>2&&!this.finished&&(this.start(),r.push({type:`stage_start`,time:this.time})),Math.abs(i.c)>a+this.margin?(this.offCourseTimer+=e,!this.offCourse&&this.offCourseTimer>this.offTime&&(this.offCourse=!0,r.push({type:`off_course`,s:i.s,lateral:i.c}))):(this.offCourseTimer=0,this.offCourse&&(this.offCourse=!1,r.push({type:`back_on_course`,s:i.s})));this.nextCheckpoint<this.checkpoints.length&&this.maxS>=this.checkpoints[this.nextCheckpoint].distance;){let e=this.checkpoints[this.nextCheckpoint++],t=this.time-this.startTime;this.splits.push({name:e.name,distance:e.distance,time:t}),r.push({type:`checkpoint`,name:e.name,distance:e.distance,time:t})}return this.started&&!this.finished&&this.maxS>=this.stage.length-3&&(this.finished=!0,this.finishTime=this.time-this.startTime,r.push({type:`stage_finish`,time:this.finishTime})),r}get progress(){return Math.min(1,this.maxS/this.stage.length)}get distanceRemaining(){return Math.max(0,this.stage.length-this.s)}get elapsed(){return this.started?this.finished?this.finishTime:this.time-this.startTime:0}getState(){return{s:this.s,c:this.c,time:this.time,started:this.started,finished:this.finished,nextCheckpoint:this.nextCheckpoint,offCourseTimer:this.offCourseTimer,offCourse:this.offCourse,splits:this.splits.map(e=>({...e})),onRoad:this.onRoad,maxS:this.maxS,startTime:this.startTime,finishTime:this.finishTime}}setState(e){Object.assign(this,e,{splits:e.splits.map(e=>({...e}))})}};function Uu(e){if(typeof Buffer<`u`)return Buffer.from(e.buffer,e.byteOffset,e.byteLength).toString(`base64`);let t=``,n=32768;for(let r=0;r<e.length;r+=n)t+=String.fromCharCode.apply(null,e.subarray(r,r+n));return btoa(t)}function Wu(e){if(typeof Buffer<`u`){let t=Buffer.from(e,`base64`),n=new Uint8Array(t.length);return n.set(t),n}let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return n}function Gu(e){let t=2166136261,n=2538058380;for(let r=0;r<e.length;r++)t=Math.imul(t^e[r],16777619)>>>0,n=Math.imul(n^e[r],2246822507)>>>0;return t.toString(16).padStart(8,`0`)+n.toString(16).padStart(8,`0`)}var Ku=class{constructor(e,t,n={}){this.spline=e,this.surfaces=t,this.ds=n.rowSpacing??1,this.dc=n.columnSpacing??.25,this.footprint=n.footprintLength??.2,this.maxBerm=n.maxBerm??.15,this.diffusionInterval=n.diffusionInterval??.25;let r=0;if(e?.width?.length)for(let t=0;t<e.width.length;t++)e.width[t]>r&&(r=e.width[t]);r+=2*(e?.road?.shoulderWidth??0),this.halfWidth=r/2,this.rows=Math.ceil(e.length/this.ds)+2,this.cols=Math.ceil(r/this.dc)+1;let i=this.rows*this.cols;this.dLoose=new Float32Array(i),this.rut=new Float32Array(i),this.compaction=new Float32Array(i),this.depth0=new Float32Array(this.rows);for(let t=0;t<this.rows;t++){let n=e.layersAt(Math.min(t*this.ds,e.length));this.depth0[t]=n.length>1?n[0].depth??0:0}this.dirtyRows=new Set,this.timeSinceDiffusion=0,this.stats={swept:0,passes:0},this._cells=[],this._sampleOut={rut:0,drutDc:0,drutDs:0,dLoose:0,compaction:0}}_col(e){return(e+this.halfWidth)/this.dc}_idx(e,t){return e*this.cols+t}inside(e,t){return e>=0&&e<this.rows&&t>=0&&t<this.cols}_bilinear(e,t,n){let r=t/this.ds,i=this._col(n),a=Math.floor(r),o=Math.floor(i);if(a<0||a>=this.rows-1||o<0||o>=this.cols-1)return 0;let s=r-a,c=i-o,l=e[this._idx(a,o)],u=e[this._idx(a,o+1)],d=e[this._idx(a+1,o)],f=e[this._idx(a+1,o+1)];return(l*(1-c)+u*c)*(1-s)+(d*(1-c)+f*c)*s}sample(e,t){let n=this._sampleOut,r=this.dc*.5;return n.rut=this._bilinear(this.rut,e,t),n.drutDc=(this._bilinear(this.rut,e,t+r)-this._bilinear(this.rut,e,t-r))/(2*r),n.drutDs=(this._bilinear(this.rut,e+this.ds*.5,t)-this._bilinear(this.rut,e-this.ds*.5,t))/this.ds,n.dLoose=this._bilinear(this.dLoose,e,t),n.compaction=this._bilinear(this.compaction,e,t),n}layersAt(e,t,n,r=this.sample(t,n)){if(e.length<2)return e;let i=e[0],a=this.surfaces.def(i.type),o=((i.depth??0)+r.dLoose)*(1-.5*r.compaction),s=Math.max(0,r.rut),c=i.type,l=a.evolution;return l?.compactTo&&r.compaction>l.compactThreshold&&(c=l.compactTo,o*=.4),o<.002?e.slice(1):[{type:c,depth:o,sinkage:s},...e.slice(1)]}applyPass(e){let t=Math.round(e.s/this.ds);if(t<0||t>=this.rows)return;let n=e.layers[0],r=this.surfaces.def(n.type).evolution,i=this.surfaces.def(e.layers[e.layers.length-1].type),a=Math.max(e.distance,0);if(a<=0)return;let o=X(e.load/4e3,.2,3),s=e.width/2,c=Math.max(0,Math.floor(this._col(e.c-s)-.5)),l=Math.min(this.cols-1,Math.ceil(this._col(e.c+s)+.5)),u=this._cells;u.length=0;for(let t=c;t<=l;t++){let n=t*this.dc-this.halfWidth,r=Math.min(e.c+s,n+this.dc/2)-Math.max(e.c-s,n-this.dc/2);r>1e-6&&u.push({j:t,w:Math.min(1,r/this.dc)})}if(!u.length)return;let d=u[0].j,f=u[u.length-1].j;if(this.stats.passes++,r?.loose&&e.layers.length>1){let n=r.sweepPerMeter*a*o*(1+4*Z(e.slip)),i=Math.min(.9,n),s=0;for(let{j:e,w:n}of u){let r=this._idx(t,e),a=this.depth0[t]+this.dLoose[r],o=Math.min(a,a*i*n);o>0&&(this.dLoose[r]-=o,s+=o)}if(s>0){let n=X(.5+.35*e.lateralBias,.1,.9);this._deposit(t,f+1,1,s*n,r),this._deposit(t,d-1,-1,s*(1-n),r),this.stats.swept+=s*this.dc*this.ds,this.dirtyRows.add(t)}}let p=r?.bearingPressure?r:i.evolution??null;if(p?.bearingPressure){let n=Math.max(e.width,.05)*this.footprint,i=e.load/n;if(i>p.bearingPressure){let e=Math.min(p.maxRut,(i-p.bearingPressure)/p.soilStiffness),n=1-Math.exp(-a/.5),o=0;for(let{j:r,w:i}of u){let a=this._idx(t,r),s=Math.max(0,e-this.rut[a])*n*i;s>0&&(this.rut[a]+=s,o+=s)}if(o>0){let e=o*(r?.ridgeFraction??.3)*.5;for(let n of[d-1,f+1])if(n>=0&&n<this.cols){let r=this._idx(t,n);this.rut[r]=Math.max(-.3*p.maxRut,this.rut[r]-e)}this.dirtyRows.add(t)}}}let m=(r?.compactionPerMeter??i.evolution?.compactionPerMeter??0)*a*o;if(m>0)for(let{j:e,w:n}of u){let r=this._idx(t,e);this.compaction[r]+=(1-this.compaction[r])*(1-Math.exp(-m*n))}}_deposit(e,t,n,r,i){let a=r;for(let r=0;r<6&&a>1e-9;r++,t+=n){if(t<0||t>=this.cols)return;let n=this._idx(e,t),r=Math.max(0,this.maxBerm-this.dLoose[n]),i=Math.min(r,a);this.dLoose[n]+=i,a-=i}}update(e,t){let n=t.chassis,r=this.spline;for(let t of n.wheels){let i=t.terrainSample;if(!t.contact||!i||i.s===void 0||!i.onRoad)continue;let a=r.sampleAt(i.s),o=n.velocity.x*a.rx+n.velocity.z*a.rz,s=n.velocity.x*a.tx+n.velocity.z*a.tz,c=Math.hypot(o,s)*e;this.applyPass({s:i.s,c:i.c,distance:c,load:t.fn,width:t.tire.cfg.width,slip:t.tire.out.saturation,lateralBias:Math.tanh(o/4),layers:r.layersAt(i.s)})}this.timeSinceDiffusion+=e,this.timeSinceDiffusion>=this.diffusionInterval&&(this.relax(this.timeSinceDiffusion),this.timeSinceDiffusion=0)}relax(e){let t=Array.from(this.dirtyRows).sort((e,t)=>e-t);this.dirtyRows.clear();for(let e of t){let t=this.spline.layersAt(Math.min(e*this.ds,this.spline.length)),n=t.length>1?this.surfaces.def(t[0].type).evolution:null;if(!n?.loose)continue;let r=n.reposeSlope*this.dc,i=!1;for(let t=0;t<3;t++)for(let t=0;t<this.cols-1;t++){let n=this._idx(e,t),a=n+1,o=this.dLoose[n]-this.dLoose[a];if(Math.abs(o)>r){let t=(Math.abs(o)-r)*.25*Math.sign(o),s=t>0?Math.min(t,this.depth0[e]+this.dLoose[n]):-Math.min(-t,this.depth0[e]+this.dLoose[a]);this.dLoose[n]-=s,this.dLoose[a]+=s,i=!0}}i&&this.dirtyRows.add(e)}}seedWithPasses(e,t={}){let n=new wu(t.seed??99),r=t.trackWidth??1.55,i=t.tyreWidth??.2,a=t.load??3200,o=t.lineGain??14,s=this.spline;for(let t=0;t<e;t++){let e=n.range(0,1e3),t=n.range(.15,.45);for(let n=0;n<s.length;n+=this.ds){let c=s.sampleAt(n),l=c.width/2-1.1,u=X(-s.kappaRobust[c.index]*o*l,-l,l)+t*Du(n/25+e,3,2),d=s.layersAt(n);for(let e of[-1,1])this.applyPass({s:n,c:u+e*r/2,distance:this.ds,load:a,width:i,slip:.1+.4*Math.abs(c.kappa)*40,lateralBias:Math.sign(-c.kappa)*.5,layers:d})}this.relax(1)}}looseDepthAt(e,t){let n=this.spline.layersAt(e);if(n.length<2)return 0;let r=this.sample(e,t);return Math.max(0,(n[0].depth??0)+r.dLoose)}meanLooseDepth(e,t,n){let r=0,i=0;for(let a=t;a<=n;a+=this.dc)r+=this.looseDepthAt(e,a),i++;return i?r/i:0}stateHash(){return Gu(new Uint8Array(this.dLoose.buffer))+Gu(new Uint8Array(this.rut.buffer))+Gu(new Uint8Array(this.compaction.buffer))}getState(){return{rows:this.rows,cols:this.cols,dLoose:Uu(new Uint8Array(this.dLoose.buffer)),rut:Uu(new Uint8Array(this.rut.buffer)),compaction:Uu(new Uint8Array(this.compaction.buffer)),dirtyRows:Array.from(this.dirtyRows),timeSinceDiffusion:this.timeSinceDiffusion,stats:{...this.stats}}}setState(e){if(e.rows!==this.rows||e.cols!==this.cols)throw RangeError(`surface evolution snapshot has different grid dimensions`);let t=e=>{let t=Wu(e);return new Float32Array(t.buffer,t.byteOffset,t.byteLength/4)};this.dLoose=Float32Array.from(t(e.dLoose)),this.rut=Float32Array.from(t(e.rut)),this.compaction=Float32Array.from(t(e.compaction)),this.dirtyRows=new Set(e.dirtyRows),this.timeSinceDiffusion=e.timeSinceDiffusion,this.stats={...e.stats}}reset(){this.dLoose.fill(0),this.rut.fill(0),this.compaction.fill(0),this.dirtyRows.clear(),this.stats={swept:0,passes:0},this.timeSinceDiffusion=0}},qu=class{constructor(e,t){this.cfg=e,this.ambientK=t,this.coolantVolume=e.coolantMass/1060,this.reset()}reset(){this.temperatureK=this.ambientK+this.cfg.initialTempOffsetK,this.level=1,this.punctures=[],this.blockage=0,this.engineDamage=0,this.overheatTime=0,this.heatIn=0,this.heatOut=0,this.leakRate=0,this.seized=!1}addPuncture(e){this.punctures.push({size:Z(e)})}get totalHoleSize(){return this.punctures.reduce((e,t)=>e+t.size,0)}update(e,t){let n=this.cfg,r=this.temperatureK,i=t.ambientK??this.ambientK,a=n.heatFractionToCoolant*t.fuelMassFlow*Ql,o=(t.speed+n.fanSpeedEquivalent)/n.radiatorAirReferenceSpeed,s=.12+.88*su(n.thermostatOpenK,n.thermostatFullK,r),c=.08+.92*su(n.airLockLevel,Math.min(.9,n.airLockLevel+.3),this.level),l=n.radiatorUA*Math.max(o,.05)**+n.radiatorUAAirExponent*s*c*(1-n.radiatorBlockageEffect*Z(this.blockage))*(r-i),u=n.heatLossToAmbient*(r-i),d=n.coolantMass*n.coolantSpecificHeat*Math.max(this.level,.15)+n.engineThermalMass;this.temperatureK=X(r+e*(a-l-u)/d,i-2,470),this.heatIn=a,this.heatOut=l+u;let f=Math.max(0,n.systemPressure*X((this.temperatureK-300)/73,0,1.5)-0)*+(this.level>.02);this.leakRate=0,this.level>0&&this.punctures.length&&(this.leakRate=this.totalHoleSize*n.leakCoefficient*Math.sqrt(f),this.level=Math.max(0,this.level-this.leakRate*e/this.coolantVolume)),this.temperatureK>n.seizeK?(this.overheatTime+=e,this.engineDamage=Z(this.overheatTime/n.seizeTime)):this.overheatTime=Math.max(0,this.overheatTime-e*.05),this.engineDamage>=1&&(this.seized=!0)}getState(){return{temperatureK:this.temperatureK,level:this.level,punctures:this.punctures.map(e=>({...e})),blockage:this.blockage,engineDamage:this.engineDamage,overheatTime:this.overheatTime,heatIn:this.heatIn,heatOut:this.heatOut,leakRate:this.leakRate,seized:this.seized}}setState(e){Object.assign(this,e,{punctures:e.punctures.map(e=>({...e}))})}},Ju=new Set([`mud`]),Yu=new Set([`snow`]),Xu=class{constructor(e,t,n={}){this.cfg=e,this.ambientK=t,this.cooling=new qu(e.cooling,t),this.rng=new wu(n.seed??e.seed??1),this.reset()}reset(){this.cooling.reset(),this.blockMud=0,this.blockSnow=0,this.blockDust=0,this.tieRodEnergy=[0,0,0,0],this.tieRodBend=[0,0,0,0],this.tieRodQuiet=[0,0,0,0],this.turboDamage=0,this.damperTravel=[0,0,0,0],this.events=[],this.strikes=0,this.lastZ=null,this.totalImpactEnergy=0,this.distance=0,this.underbodyEnergy=0,this.underbodyTime=0,this.hullEnergy={},this.hullQuiet=0,this.hullTime=0}get intercoolerBlockage(){return Z(this.blockMud+this.blockSnow+this.blockDust)}get coolantK(){return this.cooling.temperatureK}get enginePowerScale(){return this.cooling.seized?0:Z(1-.85*this.cooling.engineDamage)*(1-.25*this.turboDamage)}get boostLeakScale(){return 1-(1-this.cfg.turbo.boostLeakAtFullDamage)*this.turboDamage}get engineSeized(){return this.cooling.seized}applyImpact(e){let t=this.cfg.impact,n=Math.max(0,e.energy);if(n<=0)return;this.totalImpactEnergy+=n;let r=e.zone;if(r===`front`||r===`underbody`||r===`stone`&&e.target===`radiator`){let e=r===`underbody`?n*t.underbodyRadiatorEnergyFactor:n;if(e>t.radiatorHitEnergyJ){let n;n=e<=t.radiatorPunctureEnergyJ?.03+.17*Z((e-t.radiatorHitEnergyJ)/(t.radiatorPunctureEnergyJ-t.radiatorHitEnergyJ)):.2+.3*Z((e-t.radiatorPunctureEnergyJ)/t.radiatorPunctureEnergyJ),this.cooling.addPuncture(n),this.events.push({type:`radiator_puncture`,size:n,energy:e})}else this.cooling.blockage=Z(this.cooling.blockage+.02*(e/t.radiatorHitEnergyJ))}if(r===`wheel`||r===`stone`&&e.target===`tire`){let t=e.wheel??0;r===`wheel`&&(this.tieRodEnergy[t]+=n)}else{if(r===`left`||r===`right`){let e=r===`left`?[0,2]:[1,3];for(let t of e)this.tieRodEnergy[t]+=n*.5}r===`front`&&(this.tieRodEnergy[0]+=n*.25,this.tieRodEnergy[1]+=n*.25)}}update(e,t,n={}){let r=t.chassis,i=t.drivetrain.engine,a=this.cfg;this.events.length=0;let o=r.speed;this.distance+=o*e,this.cooling.update(e,{fuelMassFlow:i.mdotFuel,speed:o,ambientK:this.ambientK}),this.cooling.seized&&i.running&&this.events.push({type:`engine_seized`});let s=[r.wheels[0],r.wheels[1]],c=0,l=0,u=0;for(let e of s){let n=e.surface;if(!e.contact||!n||n.looseDepth===void 0)continue;let r=t.surfacesLib?t.surfacesLib.def(n.dominant):null,i=r?r.category:`none`;Ju.has(i)?c+=n.looseDepth*.5:Yu.has(i)?l+=n.looseDepth*.5:(i===`gravel`||i===`dirt`)&&(u+=Math.max(n.looseDepth,.01)*.5)}let d=a.intercooler,f=o*e;this.blockMud=Z(this.blockMud+c*d.mudBlockPerMeterSplash*f),this.blockSnow=Z(this.blockSnow+l*d.snowBlockPerMeter*f),this.blockDust=Z(this.blockDust+u*d.gravelDustBlockPerMeter*f),this.blockDust=Z(this.blockDust*(1-d.airflowClearRate*(o/d.speedForClearing)*e)),(i.intakeTempK>330||this.cooling.temperatureK>360)&&(this.blockSnow=Z(this.blockSnow-.02*e)),this.cooling.blockage=Z(.6*(this.blockMud+this.blockSnow+this.blockDust));let p=a.impact;for(let t=0;t<4;t++){let n=r.wheels[t],i=t>=2?.5:1,o=n.fn>1?Math.min(1.5,Math.abs(n.fy)/n.fn):0,s=(.3*n.impactEnergy+p.shockToEnergy*n.shockImpulse*10*(.3+o))*i;if(s>0)this.tieRodEnergy[t]+=s,this.tieRodQuiet[t]=0,this.totalImpactEnergy+=s;else if(this.tieRodEnergy[t]>0&&(this.tieRodQuiet[t]+=e,this.tieRodQuiet[t]>=p.episodeGap)){if(this.tieRodEnergy[t]>p.tieRodBendEnergyJ){let e=(this.tieRodEnergy[t]-p.tieRodBendEnergyJ)*p.tieRodBendRadPerJoule*(this.rng.next()<.5?-1:1);this.tieRodBend[t]=X(this.tieRodBend[t]+e,-p.tieRodMaxToeRad,p.tieRodMaxToeRad),this.events.push({type:`tie_rod_bent`,wheel:t,toeErrorRad:this.tieRodBend[t],energy:this.tieRodEnergy[t]})}this.tieRodEnergy[t]=0,this.tieRodQuiet[t]=0}n.toeDamage=this.tieRodBend[t],this.lastZ&&(this.damperTravel[t]+=Math.abs(n.z-this.lastZ[t])),n.damperHealth=X(1-a.damperWearPerMeter*this.damperTravel[t]*1e3,.4,1)}if(this.lastZ=r.wheels.map(e=>e.z),r.underbody.contact?(this.underbodyEnergy+=r.underbody.energy,this.underbodyTime+=e,this.underbodyTime>=.25&&(this.applyImpact({zone:`underbody`,energy:this.underbodyEnergy}),this.underbodyEnergy=0,this.underbodyTime=0)):this.underbodyEnergy>0&&(this.applyImpact({zone:`underbody`,energy:this.underbodyEnergy}),this.underbodyEnergy=0,this.underbodyTime=0),r.hullHits.length){for(let e of r.hullHits)this.hullEnergy[e.zone]=(this.hullEnergy[e.zone]??0)+e.energy;this.hullQuiet=0,this.hullTime+=e}if(Object.keys(this.hullEnergy).length&&(r.hullHits.length||(this.hullQuiet+=e),this.hullTime>=.25||this.hullQuiet>=.2)){for(let[e,t]of Object.entries(this.hullEnergy))t<5||(e===`roof`||e===`rear`?(this.totalImpactEnergy+=t,this.events.push({type:`body_impact`,zone:e,energy:t})):this.applyImpact({zone:`front`,energy:t}));this.hullEnergy={},this.hullQuiet=0,this.hullTime=0}let m=Math.max(s[0].surface?.looseDepth??0,s[1].surface?.looseDepth??0);if(m>0&&o>5){let t=p.stoneStrikePerSecondAt30ms*(o/30)**2*X(m/p.looseDepthForStones,.2,3);if(this.rng.next()<t*e){let e=this.rng.next(),t=150*Math.exp(.7*this.rng.gaussian())*(o/30)**2;if(this.strikes++,e<.35)this.applyImpact({zone:`stone`,target:`radiator`,energy:t});else if(e<.8){let e=this.rng.int(4);t>p.tireLeakEnergyJ&&(r.wheels[e].tire.leakRate+=p.tireLeakRate*X(t/p.tireLeakEnergyJ,1,4),this.events.push({type:`tire_puncture`,wheel:e,leakRate:r.wheels[e].tire.leakRate}))}else this.applyImpact({zone:`underbody`,energy:t*.6})}}let h=a.turbo;i.turbo.omega>i.turbo.omegaMax&&(this.turboDamage=Z(this.turboDamage+h.overspeedDamagePerSecond*e)),i.exhaustTempK>h.exhaustDamageK&&(this.turboDamage=Z(this.turboDamage+h.exhaustDamagePerSecond*e))}summary(e){let t=e.drivetrain,n=e.brakes,r=e.chassis;return{radiator:{coolantLevel:this.cooling.level,punctures:this.cooling.punctures.length,holeSize:this.cooling.totalHoleSize,leakRate:this.cooling.leakRate,temperatureC:this.cooling.temperatureK-273.15,blockage:this.cooling.blockage},intercooler:{blockage:this.intercoolerBlockage,mud:this.blockMud,snow:this.blockSnow,dust:this.blockDust},engine:{damage:this.cooling.engineDamage,seized:this.cooling.seized,powerScale:this.enginePowerScale,turboDamage:this.turboDamage},tieRods:this.tieRodBend.map(e=>({toeErrorDeg:e*180/Math.PI})),brakes:n.discK.map((e,t)=>({discTempC:e-273.15,fade:n.fade[t],padWear:n.padWear[t],fluidTempC:n.fluidK[t]-273.15})),clutch:{wear:t.clutch.wear,temperatureC:t.clutch.temperatureK-273.15},gearbox:{wear:t.transmission.wear},tires:r.wheels.map(e=>({wear:e.tire.wear,pressureKPa:e.tire.pressurePa/1e3,leakRate:e.tire.leakRate})),dampers:r.wheels.map(e=>({health:e.damperHealth})),stoneStrikes:this.strikes}}getState(){return{cooling:this.cooling.getState(),rng:this.rng.getState(),blockMud:this.blockMud,blockSnow:this.blockSnow,blockDust:this.blockDust,tieRodEnergy:this.tieRodEnergy.slice(),tieRodBend:this.tieRodBend.slice(),tieRodQuiet:this.tieRodQuiet.slice(),turboDamage:this.turboDamage,damperTravel:this.damperTravel.slice(),strikes:this.strikes,lastZ:this.lastZ?this.lastZ.slice():null,totalImpactEnergy:this.totalImpactEnergy,distance:this.distance,underbodyEnergy:this.underbodyEnergy,underbodyTime:this.underbodyTime,hullEnergy:{...this.hullEnergy},hullQuiet:this.hullQuiet,hullTime:this.hullTime}}setState(e){this.cooling.setState(e.cooling),this.rng.setState(e.rng),this.blockMud=e.blockMud,this.blockSnow=e.blockSnow,this.blockDust=e.blockDust,this.tieRodEnergy=e.tieRodEnergy.slice(),this.tieRodBend=e.tieRodBend.slice(),this.tieRodQuiet=e.tieRodQuiet.slice(),this.turboDamage=e.turboDamage,this.damperTravel=e.damperTravel.slice(),this.strikes=e.strikes,this.lastZ=e.lastZ?e.lastZ.slice():null,this.totalImpactEnergy=e.totalImpactEnergy,this.distance=e.distance,this.underbodyEnergy=e.underbodyEnergy,this.underbodyTime=e.underbodyTime,this.hullEnergy={...e.hullEnergy},this.hullQuiet=e.hullQuiet,this.hullTime=e.hullTime}},Q={create:(e=0,t=0,n=0)=>({x:e,y:t,z:n}),clone:e=>({x:e.x,y:e.y,z:e.z}),set(e,t,n,r){return e.x=t,e.y=n,e.z=r,e},copy(e,t){return e.x=t.x,e.y=t.y,e.z=t.z,e},add:(e,t)=>({x:e.x+t.x,y:e.y+t.y,z:e.z+t.z}),sub:(e,t)=>({x:e.x-t.x,y:e.y-t.y,z:e.z-t.z}),scale:(e,t)=>({x:e.x*t,y:e.y*t,z:e.z*t}),addScaled:(e,t,n)=>({x:e.x+t.x*n,y:e.y+t.y*n,z:e.z+t.z*n}),dot:(e,t)=>e.x*t.x+e.y*t.y+e.z*t.z,cross:(e,t)=>({x:e.y*t.z-e.z*t.y,y:e.z*t.x-e.x*t.z,z:e.x*t.y-e.y*t.x}),lengthSq:e=>e.x*e.x+e.y*e.y+e.z*e.z,length:e=>Math.hypot(e.x,e.y,e.z),distance:(e,t)=>Math.hypot(e.x-t.x,e.y-t.y,e.z-t.z),normalize(e,t={x:1,y:0,z:0}){let n=Math.hypot(e.x,e.y,e.z);return n>1e-12?{x:e.x/n,y:e.y/n,z:e.z/n}:{x:t.x,y:t.y,z:t.z}},lerp:(e,t,n)=>({x:e.x+(t.x-e.x)*n,y:e.y+(t.y-e.y)*n,z:e.z+(t.z-e.z)*n}),reject:(e,t)=>{let n=e.x*t.x+e.y*t.y+e.z*t.z;return{x:e.x-t.x*n,y:e.y-t.y*n,z:e.z-t.z*n}},isFinite:e=>Number.isFinite(e.x)&&Number.isFinite(e.y)&&Number.isFinite(e.z)},$={identity:()=>({x:0,y:0,z:0,w:1}),clone:e=>({x:e.x,y:e.y,z:e.z,w:e.w}),mul:(e,t)=>({x:e.w*t.x+e.x*t.w+e.y*t.z-e.z*t.y,y:e.w*t.y-e.x*t.z+e.y*t.w+e.z*t.x,z:e.w*t.z+e.x*t.y-e.y*t.x+e.z*t.w,w:e.w*t.w-e.x*t.x-e.y*t.y-e.z*t.z}),conj:e=>({x:-e.x,y:-e.y,z:-e.z,w:e.w}),normalize(e){let t=Math.hypot(e.x,e.y,e.z,e.w);return t<1e-12?{x:0,y:0,z:0,w:1}:{x:e.x/t,y:e.y/t,z:e.z/t,w:e.w/t}},fromAxisAngle(e,t){let n=t*.5,r=Math.sin(n);return{x:e.x*r,y:e.y*r,z:e.z*r,w:Math.cos(n)}},fromRotationVector(e){let t=Math.hypot(e.x,e.y,e.z);if(t<1e-9)return $.normalize({x:e.x*.5,y:e.y*.5,z:e.z*.5,w:1});let n=t*.5,r=Math.sin(n)/t;return{x:e.x*r,y:e.y*r,z:e.z*r,w:Math.cos(n)}},rotate(e,t){let n=2*(e.y*t.z-e.z*t.y),r=2*(e.z*t.x-e.x*t.z),i=2*(e.x*t.y-e.y*t.x);return{x:t.x+e.w*n+(e.y*i-e.z*r),y:t.y+e.w*r+(e.z*n-e.x*i),z:t.z+e.w*i+(e.x*r-e.y*n)}},rotateInv(e,t){return $.rotate($.conj(e),t)},toBasis(e){return{x:$.rotate(e,{x:1,y:0,z:0}),y:$.rotate(e,{x:0,y:1,z:0}),z:$.rotate(e,{x:0,y:0,z:1})}},fromBasis(e,t,n){let r=e.x,i=t.x,a=n.x,o=e.y,s=t.y,c=n.y,l=e.z,u=t.z,d=n.z,f=r+s+d,p;if(f>0){let e=Math.sqrt(f+1)*2;p={w:.25*e,x:(u-c)/e,y:(a-l)/e,z:(o-i)/e}}else if(r>s&&r>d){let e=Math.sqrt(1+r-s-d)*2;p={w:(u-c)/e,x:.25*e,y:(i+o)/e,z:(a+l)/e}}else if(s>d){let e=Math.sqrt(1+s-r-d)*2;p={w:(a-l)/e,x:(i+o)/e,y:.25*e,z:(c+u)/e}}else{let e=Math.sqrt(1+d-r-s)*2;p={w:(o-i)/e,x:(a+l)/e,y:(c+u)/e,z:.25*e}}return $.normalize(p)},lookAlong(e,t={x:0,y:1,z:0}){let n=Q.normalize(e),r=Q.cross(n,t);Q.lengthSq(r)<1e-10&&(r=Q.cross(n,{x:0,y:0,z:1})),r=Q.normalize(r);let i=Q.cross(r,n);return $.fromBasis(n,i,r)}};function Zu(e,t){if(!Array.isArray(e)||e.length<2)throw RangeError(`${t}: need at least 2 breakpoints`);for(let n=0;n<e.length;n++){if(!Number.isFinite(e[n]))throw RangeError(`${t}: breakpoint ${n} is not finite`);if(n>0&&!(e[n]>e[n-1]))throw RangeError(`${t}: breakpoints must be strictly increasing (index ${n})`)}}function Qu(e,t,n,r){let i=((2*e+t)*n-e*r)/(e+t);return Math.sign(i)===Math.sign(n)?Math.sign(n)!==Math.sign(r)&&Math.abs(i)>3*Math.abs(n)&&(i=3*n):i=0,i}function $u(e,t){let n=e.length,r=Array(n-1),i=Array(n-1),a=Array(n);for(let a=0;a<n-1;a++)r[a]=e[a+1]-e[a],i[a]=(t[a+1]-t[a])/r[a];if(n===2)return a[0]=a[1]=i[0],a;for(let e=1;e<n-1;e++)if(i[e-1]*i[e]<=0)a[e]=0;else{let t=2*r[e]+r[e-1],n=r[e]+2*r[e-1];a[e]=(t+n)/(t/i[e-1]+n/i[e])}return a[0]=Qu(r[0],r[1],i[0],i[1]),a[n-1]=Qu(r[n-2],r[n-3],i[n-2],i[n-3]),a}var ed=class{constructor(e,{smooth:t=!1,extrapolate:n=`clamp`,label:r=`Table1D`}={}){let i,a;if(Array.isArray(e))i=e.map(e=>e[0]),a=e.map(e=>e[1]);else if(e&&Array.isArray(e.x)&&Array.isArray(e.y))i=e.x.slice(),a=e.y.slice();else throw TypeError(`${r}: expected [[x,y],...] or {x:[],y:[]}`);if(i.length!==a.length)throw RangeError(`${r}: x and y length mismatch`);Zu(i,r),a.forEach((e,t)=>{if(!Number.isFinite(e))throw RangeError(`${r}: y[${t}] is not finite`)}),this.xs=i,this.ys=a,this.smooth=t,this.extrapolate=n,this.slopes=t?$u(i,a):null,this.xMin=i[0],this.xMax=i[i.length-1],this._i=0}_segment(e){let t=this.xs,n=t.length,r=this._i;if(r>=n-1&&(r=n-2),e>=t[r]&&e<=t[r+1])return r;let i=0,a=n-2;for(;i<a;){let n=i+a+1>>1;t[n]<=e?i=n:a=n-1}return this._i=i,i}eval(e){let{xs:t,ys:n}=this,r=t.length;if(e<=t[0]){if(this.extrapolate===`linear`){let r=this.smooth?this.slopes[0]:(n[1]-n[0])/(t[1]-t[0]);return n[0]+r*(e-t[0])}return n[0]}if(e>=t[r-1]){if(this.extrapolate===`linear`){let i=this.smooth?this.slopes[r-1]:(n[r-1]-n[r-2])/(t[r-1]-t[r-2]);return n[r-1]+i*(e-t[r-1])}return n[r-1]}let i=this._segment(e),a=t[i+1]-t[i],o=(e-t[i])/a;if(!this.smooth)return n[i]+(n[i+1]-n[i])*o;let s=o*o,c=s*o,l=this.slopes;return(2*c-3*s+1)*n[i]+(c-2*s+o)*a*l[i]+(-2*c+3*s)*n[i+1]+(c-s)*a*l[i+1]}maxY(){if(!this.smooth)return Math.max(...this.ys);let e=-1/0;for(let t=0;t<=200;t++)e=Math.max(e,this.eval(this.xMin+(this.xMax-this.xMin)*t/200));return e}},td=class e{constructor(e,t=`Table2D`){if(!e||!Array.isArray(e.x)||!Array.isArray(e.y)||!Array.isArray(e.z))throw TypeError(`${t}: expected {x:[],y:[],z:[[]]}`);if(Zu(e.x,`${t}.x`),Zu(e.y,`${t}.y`),e.z.length!==e.y.length)throw RangeError(`${t}: z must have one row per y breakpoint`);e.z.forEach((n,r)=>{if(!Array.isArray(n)||n.length!==e.x.length)throw RangeError(`${t}: z row ${r} must have ${e.x.length} columns`);n.forEach((e,n)=>{if(!Number.isFinite(e))throw RangeError(`${t}: z[${r}][${n}] is not finite`)})}),this.xs=e.x.slice(),this.ys=e.y.slice(),this.z=e.z.map(e=>e.slice())}static _find(e,t){let n=e.length;if(t<=e[0])return[0,0];if(t>=e[n-1])return[n-2,1];let r=0,i=n-2;for(;r<i;){let n=r+i+1>>1;e[n]<=t?r=n:i=n-1}return[r,(t-e[r])/(e[r+1]-e[r])]}eval(t,n){let[r,i]=e._find(this.xs,t),[a,o]=e._find(this.ys,n),s=this.z,c=s[a][r]+(s[a][r+1]-s[a][r])*i;return c+(s[a+1][r]+(s[a+1][r+1]-s[a+1][r])*i-c)*o}},nd=class{constructor(e,t){this.cfg=e,this.ambient={pressure:t.pressure,temperature:t.temperature},this.omegaMax=e.maxShaftSpeed,this.reset()}reset(){this.omega=this.cfg.idleShaftSpeed??2e3,this.pPlenum=this.ambient.pressure,this.wgOpen=0,this.bovOpen=0,this.mdotCompressor=0,this.pressureRatio=1,this.pressureRatioTurbine=1,this.compressorOutTempK=this.ambient.temperature,this.surge=!1,this.overspeed=!1}get boostGaugePa(){return Math.max(0,this.pPlenum-this.ambient.pressure)}pressureRatioCapability(e=this.omega){let t=this.cfg.compressor,n=e*t.tipRadius;return(1+t.efficiency*t.workCoefficient*n*n/(Yl*this.ambient.temperature))**(Jl/(Jl-1))}step(e,t){let n=this.cfg,r=this.ambient,i=e/4,a=r.pressure,o=r.temperature,s=n.wastegate,c=n.blowOff,l=n.compressor,u=n.turbine,d=Math.max(250,t.plenumTempK),f=this.boostGaugePa,p=Z((f-(s.springPressure+Z(t.wastegateDuty)*(s.maxControlPressure-s.springPressure)))/s.pressureRange+ +!!this.overspeed);this.wgOpen=cu(this.wgOpen,p,s.responseTime,e),this.bovOpen=cu(this.bovOpen,+!!t.bovCommand,c.responseTime,e);let m=t.mdotExhaust*(1-s.flowFraction*this.wgOpen),h=m*Math.sqrt(t.exhaustTempK)/(u.flowCoefficient*a),g=Math.sqrt(1+h*h);this.pressureRatioTurbine=g;let _=1-g**(-(Xl-1)/Xl),v=u.efficiency*m*Zl*t.exhaustTempK*_,y=0;for(let e=0;e<4;e++){let e=Math.max(this.omega,800),r=this.pressureRatioCapability(this.omega),s=Math.max(1,this.pPlenum/a);this.omega*l.tipRadius;let u=l.chokeFlow*(this.omega/l.referenceSpeed)*(1+.15*(this.omega/l.referenceSpeed-1)),f,p=Math.max(r-1,1e-6),m=(s-1)/p;m<1?(f=Math.max(0,u)*Math.sqrt(1-m*m),this.surge=!1):(f=-l.surgeBackflow*Math.max(u,.02)*Math.min(m-1,1),this.surge=!0);let h=Math.max(f,0)*Yl*o*(s**((Jl-1)/Jl)-1)/l.efficiency,g=v/e,_=h/e,b=this.cfg.frictionCoefficient*this.omega+(this.cfg.coulombFriction??0);this.omega=X(this.omega+i*(g-_-b)/this.cfg.shaftInertia,300,this.omegaMax*1.15);let x=Math.max(0,this.pPlenum-a),S=this.bovOpen*c.flowCoefficient*x/Math.sqrt(ql*d),C=(1-Z(t.leakScale))*1e-4*x/Math.sqrt(ql*d),w=ql*d/n.plenumVolume*(f-t.mdotEngine-S-C)*i;this.pPlenum=Math.max(a,this.pPlenum+w),y+=f/4,this.pressureRatio=s,this.compressorOutTempK=o*(1+(s**((Jl-1)/Jl)-1)/l.efficiency)}this.mdotCompressor=y,this.overspeed=this.omega>this.omegaMax}getState(){return{omega:this.omega,pPlenum:this.pPlenum,wgOpen:this.wgOpen,bovOpen:this.bovOpen,mdotCompressor:this.mdotCompressor,pressureRatio:this.pressureRatio,pressureRatioTurbine:this.pressureRatioTurbine,compressorOutTempK:this.compressorOutTempK,surge:this.surge,overspeed:this.overspeed}}setState(e){Object.assign(this,e)}},rd=class{constructor(e,t,n){this.cfg=e,this.idleRpm=n,this.throttleMap=new td(e.throttleMap,`ecu.throttleMap`),this.boostMap=new td(e.boostTargetMap,`ecu.boostTargetMap`),this.wgBaseKPa=t.wastegate.springPressure/1e3,this.wgMaxKPa=t.wastegate.maxControlPressure/1e3,this.omegaMaxTurbo=t.maxShaftSpeed,this.reset()}reset(){this.limiterCut=!1,this.idleIntegral=0,this.boostIntegral=0,this.alsActive=!1,this.alsTime=0,this.alsCooldown=0,this.launchActive=!1,this.out={throttleCmd:0,ignitionRetardDeg:0,fuelCut:!1,boostTargetKPa:0,wastegateDuty:0,alsActive:!1,launchActive:!1,limiterActive:!1,bovAllowed:!0,fuelEnrichment:1,derate:1}}update(e,t){let n=this.cfg,r=t.omega*nu,i=this.out,a=Z(t.pedal),o=this.throttleMap.eval(r,a);if(t.running&&a<.03){let t=this.idleRpm-r;this.idleIntegral=X(this.idleIntegral+t*e,-150,250);let i=X(n.idle.kp*t+n.idle.ki*this.idleIntegral+n.idle.baseThrottle,0,n.idle.maxThrottle);o=Math.max(o,i)}else this.idleIntegral*=Math.max(0,1-2*e);let s=n.revLimiter,c=s.rpm,l=0,u=n.launch.enabled&&t.launchSwitch&&a>.9&&t.clutchPressed>.5&&t.speed<n.launch.maxSpeed;this.launchActive=u,u&&(l=n.launch.maxRetardDeg*su(n.launch.rpm-150,n.launch.rpm+100,r),c=Math.min(c,n.launch.rpm+400),o=1),r>c?this.limiterCut=!0:r<c-s.hysteresis&&(this.limiterCut=!1);let d=this.limiterCut||t.shiftCut,f=this.boostMap.eval(r,a),p=n.als,m=p.enabled&&t.alsSwitch&&t.running&&a<p.pedalThreshold&&r>=p.minRpm&&t.exhaustTempK<p.maxExhaustTempK&&this.alsCooldown<=0&&!t.shiftCut;m?(this.alsTime+=e,this.alsTime>p.maxDuration&&(m=!1,this.alsCooldown=p.cooldown,this.alsTime=0)):this.alsTime=Math.max(0,this.alsTime-e*2),this.alsCooldown>0&&(this.alsCooldown-=e),this.alsActive=m;let h=1;this.alsActive&&(o=Math.max(o,p.throttle),l=Math.max(l,p.retardDeg),f=p.boostTargetKPa,h=p.fuelMultiplier,d=!1),t.blip&&!this.alsActive&&(o=Math.max(o,n.blip.throttle));let g=t.boostKPa,_=Z((f-this.wgBaseKPa)/Math.max(1,this.wgMaxKPa-this.wgBaseKPa)),v=f-g;this.boostIntegral=X(this.boostIntegral+v*e,-n.boostControl.integralLimit,n.boostControl.integralLimit);let y=Z(_*n.boostControl.feedForward+n.boostControl.kp*v+n.boostControl.ki*this.boostIntegral);t.turboOmega>.98*this.omegaMaxTurbo&&(y=0),g>n.boostControl.overboostKPa&&(d=!0);let b=n.overheatDerate,x=1-(1-b.minPower)*su(b.startK,b.endK,t.coolantK);return i.throttleCmd=Z(o),i.ignitionRetardDeg=l,i.fuelCut=d,i.boostTargetKPa=f,i.wastegateDuty=y,i.alsActive=this.alsActive,i.launchActive=this.launchActive,i.limiterActive=this.limiterCut,i.bovAllowed=!this.alsActive&&!this.launchActive,i.fuelEnrichment=h,i.derate=x,i}getState(){return{limiterCut:this.limiterCut,idleIntegral:this.idleIntegral,boostIntegral:this.boostIntegral,alsActive:this.alsActive,alsTime:this.alsTime,alsCooldown:this.alsCooldown,launchActive:this.launchActive,out:{...this.out}}}setState(e){Object.assign(this,e,{out:{...e.out}})}},id=class{constructor(e,t){let n=e.engine;this.cfg=n,this.ambient={pressure:t.pressure,temperature:t.temperature},this.displacement=n.displacement,this.inertia=n.inertia,this.idleOmega=n.idleRpm*tu,this.stallOmega=n.stallRpm*tu,this.torqueCurve=new ed(n.torqueCurve,{smooth:!0,label:`engine.torqueCurve`}),this.dynoBoost=new ed(n.dynoBoostKPa,{smooth:!0,label:`engine.dynoBoostKPa`}),this.volEff=new ed(n.volumetricEfficiency,{smooth:!0,label:`engine.volumetricEfficiency`}),this.retardEff=new ed(n.ignition.retardEfficiency,{smooth:!0,label:`engine.ignition.retardEfficiency`}),this.turbo=new nd(e.turbo,t),this.ecu=new rd(e.ecu,e.turbo,n.idleRpm),this.ic=e.intercooler,this.reset(n.startRunning!==!1)}reset(e=!0){this.omega=e?this.idleOmega:0,this.running=e,this.thetaPlate=0,this.torqueIndicated=0,this.intakeTempK=this.ambient.temperature+25,this.manifoldPa=this.ambient.pressure*.3,this.torque=0,this.exhaustTempK=900,this.mdotAir=0,this.mdotFuel=0,this.ignitionEfficiency=1,this.starterTorque=0,this.stalled=!1,this.events=[],this.ecu.reset(),this.turbo.reset(),this.out={rpm:this.omega*nu}}get rpm(){return this.omega*nu}plateFlow(e){let t=this.cfg.throttle;return t.idleFlowFraction+(1-t.idleFlowFraction)*(1-(1-Z(e))**t.flowExponent)}frictionTorque(e){let t=this.cfg.friction;return t.f0+t.f1*e+t.f2*e*e}update(e,t){let n=this.cfg,r=this.ambient;this.events.length=0;let i=this.omega*nu;t.ignition?!this.running&&this.omega>650*tu&&!this.stalled&&(this.running=!0):this.running=!1,this.running&&this.omega<this.stallOmega&&(this.running=!1,this.stalled=!0,this.events.push({type:`engine_stall`})),(!t.ignition||t.starter)&&(this.stalled=!1),this.starterTorque=t.starter&&t.ignition&&this.omega<n.starter.cutoffRpm*tu?n.starter.torque:0,t.starter&&t.ignition&&this.omega>500*tu&&!this.running&&(this.running=!0);let a=this.ecu.update(e,{pedal:t.pedal,omega:this.omega,speed:t.speed,clutchPressed:t.clutchPressed,boostKPa:this.turbo.boostGaugePa/1e3,turboOmega:this.turbo.omega,exhaustTempK:this.exhaustTempK,coolantK:t.coolantK??360,shiftCut:!!t.shiftCut,blip:!!t.blip,alsSwitch:t.alsSwitch!==!1,launchSwitch:!!t.launchSwitch,running:this.running});this.thetaPlate=cu(this.thetaPlate,a.throttleCmd,n.throttle.responseTime,e);let o=this.plateFlow(this.thetaPlate),s=Z(t.intercoolerBlockage??0),c=this.ic.airflowBase+(1-this.ic.airflowBase)*Z(t.speed/this.ic.airflowSpeed),l=Z(this.ic.effectiveness*c*(1-this.ic.blockageEffect*s)),u=Math.max(r.temperature,this.turbo.compressorOutTempK),d=u-l*(u-r.temperature);this.intakeTempK=cu(this.intakeTempK,d,this.ic.thermalTimeConstant,e);let f=1-this.ic.pressureDropBase*(1+this.ic.blockagePressureDrop*s),p=this.turbo.pPlenum;this.manifoldPa=Math.max(2e3,p*f*o);let m=this.manifoldPa/(ql*this.intakeTempK),h=this.volEff.eval(i);this.mdotAir=this.running?m*h*this.displacement*this.omega/(2*eu):0;let g=this.dynoBoost.eval(i)*1e3,_=m/((n.dynoAmbientPressure+g)/(ql*n.dynoIntakeTempK)),v=this.frictionTorque(this.omega),y=this.retardEff.eval(a.ignitionRetardDeg);this.ignitionEfficiency=y;let b=0;this.running&&!a.fuelCut&&(b=(this.torqueCurve.eval(i)+v)*_*y*a.derate*Z(t.powerScale??1)),this.torqueIndicated=cu(this.torqueIndicated,b,n.torqueResponseTime,e);let x=v*(1+n.friction.pumpingGain*(1-o)*(this.running?1:.3))*(this.running,1);this.torque=this.torqueIndicated-x+this.starterTorque,this.omega<=0&&this.torque<0&&(this.torque=0);let S=Z(_),C=(1-y)*n.ignition.retardExhaustHeatK,w=n.exhaust.tempLowK+(n.exhaust.tempHighK-n.exhaust.tempLowK)*S+C,T=this.mdotAir*(1+a.fuelEnrichment/n.exhaust.afr);return a.alsActive&&(w+=this.ecu.cfg.als.extraExhaustK,T*=this.ecu.cfg.als.exhaustFlowBoost),this.exhaustTempK=cu(this.exhaustTempK,w,.25,e),this.mdotFuel=this.mdotAir*a.fuelEnrichment/n.exhaust.afr*+!a.fuelCut,this.turbo.step(e,{mdotEngine:this.mdotAir,mdotExhaust:T,exhaustTempK:this.exhaustTempK,wastegateDuty:a.wastegateDuty,bovCommand:a.bovAllowed&&this.thetaPlate<this.ic.bovThrottleThreshold&&this.turbo.boostGaugePa>this.ic.bovMinBoost,plenumTempK:this.intakeTempK,leakScale:t.boostLeakScale??1}),this.out={rpm:i,torque:this.torque,power:this.torque*this.omega,throttle:this.thetaPlate,boostKPa:this.turbo.boostGaugePa/1e3,...a},this.out}integrate(e,t){this.omega=Math.max(0,this.omega+e*(this.torque-t)/this.inertia)}getState(){return{omega:this.omega,running:this.running,thetaPlate:this.thetaPlate,torqueIndicated:this.torqueIndicated,intakeTempK:this.intakeTempK,manifoldPa:this.manifoldPa,torque:this.torque,exhaustTempK:this.exhaustTempK,mdotAir:this.mdotAir,mdotFuel:this.mdotFuel,ignitionEfficiency:this.ignitionEfficiency,starterTorque:this.starterTorque,stalled:this.stalled,turbo:this.turbo.getState(),ecu:this.ecu.getState()}}setState(e){let{turbo:t,ecu:n,...r}=e;Object.assign(this,r),this.turbo.setState(t),this.ecu.setState(n)}},ad=class{constructor(e){this.cfg=e,this.ambientK=293.15,this.reset()}reset(){this.pedal=1,this.wear=0,this.temperatureK=this.ambientK,this.slipping=!1,this.torque=0,this.slipSpeed=0,this.slipPower=0,this.capacityValue=0}capacity(){let e=this.cfg,t=1-this.pedal,n=this.wear*e.wear.biteShift,r=su(e.biteStart+n,e.biteEnd+n,t),i=e.thermal,a=1-(1-i.fadeMin)*su(i.fadeStartK,i.fadeEndK,this.temperatureK);return e.maxTorque*r*(1-e.wear.maxCapacityLoss*this.wear)*a}solve(e,t){let n=this.cfg;this.pedal=cu(this.pedal,Z(t.pedal),n.pedalResponseTime,e);let r=t.connected?this.capacity():0;this.capacityValue=r;let i=t.omegaEngine-t.omegaInput,a=0;if(r>1e-6){let o=1/t.engineInertia+1/t.inputInertia,s=(i/e+t.engineTorque/t.engineInertia+t.loadTorque/t.inputInertia)/o;Math.abs(s)<=r?(a=s,this.slipping=!1):(a=(s>=0?1:-1)*r*n.kineticRatio,this.slipping=!0)}else this.slipping=Math.abs(i)>1;this.torque=a,this.slipSpeed=i,this.slipPower=this.slipping?Math.abs(a*i):0;let o=n.thermal,s=(o.coolingCoeff+o.coolingPerRadS*Math.abs(t.omegaEngine))*(this.temperatureK-this.ambientK);if(this.temperatureK+=e*(this.slipPower-s)/o.heatCapacity,this.temperatureK=X(this.temperatureK,this.ambientK,1300),this.slipping){let t=1+2*su(o.fadeStartK,o.fadeEndK,this.temperatureK);this.wear=Z(this.wear+this.slipPower*e*n.wear.perJoule*t)}return a}getState(){return{pedal:this.pedal,wear:this.wear,temperatureK:this.temperatureK,slipping:this.slipping,torque:this.torque,slipSpeed:this.slipSpeed,slipPower:this.slipPower,capacityValue:this.capacityValue}}setState(e){Object.assign(this,e)}},od=class{constructor(e){if(this.cfg=e,this.type=e.type,this.ratios=e.gearRatios.slice(),!this.ratios.length)throw RangeError(`transmission.gearRatios must not be empty`);this.reverse=-Math.abs(e.reverseRatio),this.reset()}reset(e=0){this.gear=e,this.targetGear=e,this.phase=`engaged`,this.timer=0,this.cutTimer=0,this.sinceShift=1e9,this.wear=0,this.pending=null,this.events=[],this.blip=!1}get gearCount(){return this.ratios.length}get shifting(){return this.phase===`shifting`}ratioFor(e){return e===0?0:e<0?this.reverse:this.ratios[e-1]}get ratio(){return this.phase===`engaged`?this.ratioFor(this.gear):0}get connected(){return this.phase===`engaged`&&this.gear!==0}get gearName(){return this.gear<0?`R`:this.gear===0?`N`:String(this.gear)}shiftUp(){this.pending={kind:`step`,dir:1}}shiftDown(){this.pending={kind:`step`,dir:-1}}selectGear(e){this.pending={kind:`select`,gear:Math.max(-1,Math.min(this.gearCount,Math.trunc(e)))}}update(e,t){let n=this.cfg;if(this.events.length=0,this.sinceShift+=e,this.blip=!1,this.pending&&this.phase===`engaged`){let e=this.pending;this.pending=null,this._startShift(e,t)}if(this.phase===`shifting`&&(this.timer-=e,this.blip=this.blipActive,this.timer<=0)){let e=this.gear;this.gear=this.targetGear,this.phase=`engaged`,this.sinceShift=0,this.blipActive=!1,this.events.push({type:`shift`,from:e,to:this.gear})}this.cutTimer>0&&(this.cutTimer-=e);let r=n.popOut;if(this.phase===`engaged`&&this.gear>0&&this.wear>r.wearThreshold){let e=r.holdTorque*(1.2-this.wear);t.torque>e&&(this.events.push({type:`gear_popout`,gear:this.gear}),this.gear=0,this.targetGear=0,this.wear=Math.min(1,this.wear+.01))}return{ratio:this.ratio,connected:this.connected,cutIgnition:this.cutTimer>0,blip:this.blip}}_startShift(e,t){let n=this.cfg,r=e.kind===`step`?this.gear+e.dir:e.gear;if(r=Math.max(-1,Math.min(this.gearCount,r)),r===this.gear||this.sinceShift<n.minShiftInterval)return;if((r<0||this.gear<0)&&Math.abs(t.speed)>n.reverseLockoutSpeed&&r!==0){this.events.push({type:`shift_refused`,reason:`reverse_lockout`});return}let i;if(this.type===`sequential`)i=n.sequential.shiftTime,r>this.gear&&this.gear>0&&(this.cutTimer=n.sequential.ignitionCutTime),r<this.gear&&r>0&&(this.blipActive=n.sequential.autoBlip);else{if(Z(t.clutchPressed)<n.hPattern.clutchRequired){this.wear=Z(this.wear+n.hPattern.grindWear),this.events.push({type:`gear_grind`,requested:r});return}i=n.hPattern.shiftTime;let e=this.ratioFor(r),a=Math.abs(t.engineOmega-Math.abs(t.inputOmegaPerGear)*Math.abs(e));r!==0&&(this.wear=Z(this.wear+n.hPattern.syncWearPerRadS*a)),i+=n.hPattern.syncTimePerRadS*a}this.targetGear=r,this.phase=`shifting`,this.timer=r===0?Math.min(i,.05):i}efficiency(){let e=this.cfg.efficiency;return this.gear===0?1:this.gear===this.gearCount&&e.directDrive?e.directDrive:e.geared}getState(){return{gear:this.gear,targetGear:this.targetGear,phase:this.phase,timer:this.timer,cutTimer:this.cutTimer,sinceShift:this.sinceShift,wear:this.wear,pending:this.pending?{...this.pending}:null,blipActive:!!this.blipActive}}setState(e){Object.assign(this,e,{pending:e.pending?{...e.pending}:null})}},sd=class{constructor(e){this.cfg=e,this.type=e.type??`open`,this.preload=e.preload??0,this.maxLock=e.maxLockTorque??0;let t=e.pack??{};this.rampGain=t.rampGain??(t.mu&&t.surfaces&&t.meanRadius&&t.rampRadius?t.mu*t.surfaces*t.meanRadius/(2*t.rampRadius):0),this.tanPower=Math.tan((e.powerRampDeg??45)*Math.PI/180),this.tanCoast=Math.tan((e.coastRampDeg??60)*Math.PI/180),this.viscous=e.viscous??{coefficient:0,maxTorque:0},this.reset()}reset(){this.couplingTorque=0,this.capacity=0,this.locked=!1,this.powerMode=!0,this.speedDiff=0}capacityFor(e,t,n=0){let r=this.rampGain/(t?this.tanPower:this.tanCoast);return this.preload+X(n,0,1)*this.maxLock+Math.abs(e)*r}split(e,t,n,r,i,a,o=0){let s=1-n,c=r.omega-i.omega;this.speedDiff=c,this.powerMode=a;let l=0;if(this.type!==`open`){let u=r.g+i.g,d=(c/e+r.g*n*t+r.n-i.g*s*t-i.n)/u;switch(this.type){case`locked`:l=d,this.capacity=1/0,this.locked=!0;break;case`lsd`:{let e=this.capacityFor(t,a,o);this.capacity=e,l=X(d,-e,e),this.locked=Math.abs(d)<=e;break}case`viscous`:{let e=this.viscous,t=X(e.coefficient*c,-e.maxTorque,e.maxTorque);l=Math.sign(t)===Math.sign(d)?Math.sign(t)*Math.min(Math.abs(t),Math.abs(d)):0,this.capacity=e.maxTorque,this.locked=!1;break}default:throw RangeError(`unknown differential type "${this.type}"`)}}else this.capacity=0,this.locked=!1;return this.couplingTorque=l,{tA:n*t-l,tB:s*t+l,tc:l}}getState(){return{couplingTorque:this.couplingTorque,capacity:this.capacity===1/0?-1:this.capacity,locked:this.locked,powerMode:this.powerMode,speedDiff:this.speedDiff}}setState(e){Object.assign(this,e,{capacity:e.capacity<0?1/0:e.capacity})}},cd=0,ld=1,ud=2,dd=3,fd=class{constructor(e,t,n){if(this.cfg=e,this.layout=e.layout,![`AWD`,`RWD`,`FWD`].includes(this.layout))throw RangeError(`drivetrain.layout must be AWD, RWD or FWD (got ${this.layout})`);this.engine=new id(t,n),this.clutch=new ad(e.clutch),this.transmission=new od(e.transmission),this.centerDiff=new sd(e.centerDiff),this.frontDiff=new sd(e.frontDiff),this.rearDiff=new sd(e.rearDiff),this.fdF=e.finalDrive.front,this.fdR=e.finalDrive.rear,this.etaFD=e.efficiency.finalDrive,this.frontShare=this.layout===`FWD`?1:this.layout===`RWD`?0:e.centerDiff.baseSplit,this.driveTorque=[0,0,0,0],this.telemetry={},this.autoPedal=1}reset(){this.engine.reset(this.engine.cfg.startRunning!==!1),this.clutch.reset(),this.transmission.reset(),this.centerDiff.reset(),this.frontDiff.reset(),this.rearDiff.reset(),this.driveTorque=[0,0,0,0],this.autoPedal=1}shiftUp(){this.transmission.shiftUp()}shiftDown(){this.transmission.shiftDown()}selectGear(e){this.transmission.selectGear(e)}_autoClutch(e,t,n){let r=this.cfg.autoClutch;if(n===0)return 1;let i=su(r.engageStartRpm,r.engageEndRpm,e),a=su(r.speedStart,r.speedFull,Math.abs(t));return 1-Math.max(i,a)}step(e,t,n,r){let{engine:i,clutch:a,transmission:o}=this,s=r.speed,c=this.fdF,l=this.fdR,u=this.frontShare,d=.5*(n[cd].omega+n[ld].omega),f=.5*(n[ud].omega+n[dd].omega),p=c*d,m=l*f,h=this.layout===`AWD`?u*p+(1-u)*m:this.layout===`FWD`?p:m,g=i.omega*nu,_=t.clutch;_??=this.cfg.autoClutch.enabled?this._autoClutch(g,s,o.gear):0,_=Z(_);let v=o.update(e,{clutchPressed:_,speed:s,engineOmega:i.omega,inputOmegaPerGear:h,torque:Math.abs(a.torque)}),y=i.update(e,{pedal:t.throttle??0,clutchPressed:_,speed:Math.abs(s),shiftCut:v.cutIgnition,blip:v.blip,ignition:t.ignition!==!1,starter:!!t.starter,alsSwitch:!!t.alsSwitch,launchSwitch:!!t.launchSwitch,intercoolerBlockage:r.intercoolerBlockage??0,powerScale:r.powerScale??1,boostLeakScale:r.boostLeakScale??1,coolantK:r.coolantK??360}),b=n[cd].inertia+n[ld].inertia,x=n[ud].inertia+n[dd].inertia,S=b/(c*c),C=x/(l*l),w;w=this.layout===`FWD`?S:this.layout===`RWD`?C:this.cfg.centerDiff.type===`open`?1/(u*u/S+(1-u)*(1-u)/C):S+C;let T=n[cd].resist+n[ld].resist,E=n[ud].resist+n[dd].resist,D=0;this.layout!==`RWD`&&(D+=T/c),this.layout!==`FWD`&&(D+=E/l);let O=v.ratio,k=v.connected,A=O*h,j=this.cfg.transmission.inertia,M=0;k&&(j+=w/(O*O),M=-D/O);let N=a.solve(e,{pedal:_,omegaEngine:i.omega,omegaInput:A,engineInertia:i.inertia,inputInertia:j,engineTorque:y.torque,loadTorque:M,connected:k});i.integrate(e,N);let P=N*A>=0,ee=o.efficiency(),F=k?N*O*(P?ee:1/ee):0,te=Math.abs(h)<.5?F*(O>=0?1:-1)>=0:F*h>=0,ne=0,re=0,ie=this.etaFD;if(this.layout===`AWD`){let n={omega:p,g:ie*c*c/b,n:c*T/b},r={omega:m,g:ie*l*l/x,n:l*E/x},i=this.centerDiff.split(e,F,u,n,r,te,t.centerDiffLock??0);ne=i.tA,re=i.tB}else this.layout===`FWD`?(ne=F,this.centerDiff.reset()):(re=F,this.centerDiff.reset());let ae=this.driveTorque;if(ae[cd]=ae[ld]=ae[ud]=ae[dd]=0,this.layout!==`RWD`){let t=Math.abs(d)<.5?ne*(O>=0?1:-1)>=0:ne*d>=0,r=ne*c*(t?ie:1/ie),i=this.frontDiff.split(e,r,.5,{omega:n[cd].omega,g:1/n[cd].inertia,n:n[cd].resist/n[cd].inertia},{omega:n[ld].omega,g:1/n[ld].inertia,n:n[ld].resist/n[ld].inertia},t);ae[cd]=i.tA,ae[ld]=i.tB}else this.frontDiff.reset();if(this.layout!==`FWD`){let t=Math.abs(f)<.5?re*(O>=0?1:-1)>=0:re*f>=0,r=re*l*(t?ie:1/ie),i=this.rearDiff.split(e,r,.5,{omega:n[ud].omega,g:1/n[ud].inertia,n:n[ud].resist/n[ud].inertia},{omega:n[dd].omega,g:1/n[dd].inertia,n:n[dd].resist/n[dd].inertia},t);ae[ud]=i.tA,ae[dd]=i.tB}else this.rearDiff.reset();return this.telemetry={rpm:i.omega*nu,gear:o.gear,gearName:o.gearName,shifting:o.shifting,clutchPedal:_,clutchTorque:N,clutchSlipRadS:a.slipSpeed,clutchSlipping:a.slipping,driveshaftTorque:F,events:o.events},ae}getState(){return{engine:this.engine.getState(),clutch:this.clutch.getState(),transmission:this.transmission.getState(),centerDiff:this.centerDiff.getState(),frontDiff:this.frontDiff.getState(),rearDiff:this.rearDiff.getState(),driveTorque:this.driveTorque.slice()}}setState(e){this.engine.setState(e.engine),this.clutch.setState(e.clutch),this.transmission.setState(e.transmission),this.centerDiff.setState(e.centerDiff),this.frontDiff.setState(e.frontDiff),this.rearDiff.setState(e.rearDiff),this.driveTorque=e.driveTorque.slice()}};function pd(e,t,n){let r=Math.tan(Math.PI/(2*t)),i=r/(e*(1-n));for(let t=0;t<4;t++){let t=e*i,a=(1-n)*t+n*Math.atan(t)-r,o=(1-n)*e+n*e/(1+t*t);i-=a/o,i>0||(i=r/(e*(1-n)))}return i}function md(e,t,n,r){let i=t*e;return Math.sin(n*Math.atan(i-r*(i-Math.atan(i))))}var hd=class{constructor(e,t){this.cfg=e,this.ambientK=t.ambientK,this.coldK=t.coldK??t.ambientK,this.pressureColdPa=(t.pressureKPa??e.nominalPressureKPa)*1e3,this.leakRate=0,this.reset()}reset(){this.ux=0,this.uy=0,this.surfaceK=this.coldK,this.coreK=this.coldK,this.wear=0,this.out={fx:0,fy:0,mz:0,kappa:0,tanAlpha:0,power:0,muX:0,muY:0,gripScale:1,slideSpeedX:0,slideSpeedY:0,rollingMoment:0,saturation:0}}get pressurePa(){return(this.pressureColdPa+Kl)*(this.coreK/this.coldK)-Kl}verticalStiffness(){let e=this.cfg,t=(this.pressurePa/1e3-e.nominalPressureKPa)/e.nominalPressureKPa;return e.verticalStiffness*X(1+e.pressure.stiffnessSens*t,.5,1.8)}temperatureGrip(){let e=this.cfg.temperature,t=this.surfaceK-e.optimalK,n=t/(t<0?e.coldWidth:e.hotWidth);return e.minGrip+(1-e.minGrip)*Math.exp(-n*n)}pressureGrip(e){let t=this.cfg,n=(this.pressurePa/1e3-t.optimalPressureKPa)/t.optimalPressureKPa;return X(1-t.pressure.gripQuad*n*n-e*n,.5,1.25)}step(e,t){let n=this.cfg,r=this.out,i=t.surface,a=Math.max(t.fz,0);if(a<=0)return this.ux*=Math.exp(-e*30),this.uy*=Math.exp(-e*30),r.fx=r.fy=r.mz=r.power=0,r.rollingMoment=0,r.saturation=0,this._thermal(e,0,0,t,i,0),r;let o=a/n.nominalLoad,s=Math.max(.05,n.relaxationLength*(.6+.4*o)),c=n.minSpeed,l=Math.max(Math.abs(t.vcx),Math.abs(t.omega*t.re),c),u=t.omega*t.re-t.vcx,d=-t.vcy,f=l/s,p=Math.exp(-f*e),m=(1-p)/f;this.ux=this.ux*p+u*m,this.uy=this.uy*p+d*m;let h=s*n.slipClamp;this.ux=X(this.ux,-h,h),this.uy=X(this.uy,-h,h);let g=this.ux/s,_=this.uy/s+n.camberStiffnessRatio*t.camber,v=this.temperatureGrip(),y=this.pressureGrip(i.pressureSensitivity),b=1-n.wear.gripLoss*this.wear,x=X(1-n.loadSensitivity*(o-1),.5,1.3),S=v*y*b*x,C=n.mu0*i.friction*S,w=C*n.muRatioY,T=(this.pressurePa/1e3-n.nominalPressureKPa)/n.nominalPressureKPa,E=i.stiffness*X(1+n.pressure.stiffnessSens*.5*T,.6,1.5)*X(1-n.temperature.stiffnessSens*(this.surfaceK-n.temperature.optimalK)/100,.7,1.25)*(1-.15*this.wear),D=Math.sin(2*Math.atan(a/(n.stiffness.peakLoadRatio*n.nominalLoad))),O=n.stiffness.longitudinal*n.nominalLoad*D*E,k=n.stiffness.lateral*n.nominalLoad*D*E,A=C*a,j=w*a,M=0,N=0,P=0,ee;if(n.model===`brush`){ee=Math.max(.001,3*j/k);let e=O/(3*A),t=k/(3*j),r=e*g,a=t*_,o=Math.hypot(r,a);if(o>1e-9){let e=Math.hypot(u,d),t=i.slideRatio,s=t+(1-t)*Math.exp(-e/n.brush.stribeckSpeed),c=o<1?1-(1-o)**3:1;M=A*s*c*(r/o),N=j*s*c*(a/o),P=Math.min(1,o)}}else{let e=X(i.slideRatio,.3,.999),t=Math.max(n.pacejka.shapeMin,2-2/Math.PI*Math.asin(e)),r=O/(t*A),a=k/(t*j),o=pd(r,t,n.pacejka.Ex),s=pd(a,t,n.pacejka.Ey);ee=s;let c=g/o,l=_/s,u=Math.hypot(c,l);u>1e-9&&(M=c/u*A*md(u*o,r,t,n.pacejka.Ex),N=l/u*j*md(u*s,a,t,n.pacejka.Ey),P=Math.min(1,u))}let F=n.pneumaticTrail*Math.max(0,1-Math.abs(_)/(1.8*ee)),te=-N*F,ne=(this.pressurePa/1e3-n.nominalPressureKPa)/n.nominalPressureKPa,re=(i.rollingResistance*n.rollingResistance*X(1-.5*ne,.7,1.5)+n.rollingSpeedCoeff*t.vcx*t.vcx)*a*t.re*Math.tanh(t.omega*t.re/.5),ie=Math.abs(f*this.ux),ae=Math.abs(f*this.uy),oe=Math.abs(M)*ie+Math.abs(N)*ae;return this._thermal(e,oe,Math.abs(re*t.omega),t,i,a),r.fx=M,r.fy=N,r.mz=te,r.kappa=g,r.tanAlpha=_,r.power=oe,r.muX=C,r.muY=w,r.gripScale=S,r.slideSpeedX=ie,r.slideSpeedY=ae,r.rollingMoment=re,r.saturation=P,r}_thermal(e,t,n,r,i,a){let o=this.cfg,s=o.thermal,c=Math.max(r.airSpeed,0),l=s.convection0+s.convection1*c**.8,u=this.ambientK,d=i.roadTempK??u,f=a>0?X(a/o.nominalLoad,.2,2.5):0,p=s.slipHeatFraction*s.surfacePartition*t,m=s.slipHeatFraction*(1-s.surfacePartition)*t+n*s.hysteresisFraction,h=s.surfaceArea*l,g=s.coreArea*l*s.coreConvectionRatio,_=s.roadConductance*f*(i.heatTransfer??1),v=s.surfaceCoreConductance,y=(p-h*(this.surfaceK-u)-v*(this.surfaceK-this.coreK)-_*(this.surfaceK-d))/s.surfaceHeatCapacity,b=(m+v*(this.surfaceK-this.coreK)-g*(this.coreK-u))/s.coreHeatCapacity;this.surfaceK+=y*e,this.coreK+=b*e,this.surfaceK=X(this.surfaceK,200,450),this.coreK=X(this.coreK,200,420);let x=Math.max(0,this.surfaceK-o.temperature.optimalK-o.wear.overheatMarginK)/50;this.wear=Z(this.wear+t*e*(i.abrasiveness??1)*(1+2*x)/o.wear.energyToWorn),this.leakRate>0&&(this.pressureColdPa=Math.max(0,this.pressureColdPa*Math.exp(-this.leakRate*e)))}getState(){return{ux:this.ux,uy:this.uy,surfaceK:this.surfaceK,coreK:this.coreK,wear:this.wear,pressureColdPa:this.pressureColdPa,leakRate:this.leakRate,out:{...this.out}}}setState(e){Object.assign(this,e,{out:{...e.out}})}},gd=class{constructor(e){this.cfg=e;let t=e.motionRatio*e.motionRatio;this.travel=e.travel,this.kMain=e.springRate*t,this.preload=e.preload??0;let n=e.helper;this.helper=n&&n.rate>0?{k:n.rate*t,bind:n.bindTravel}:null,this.helper&&(this.zBind=this.helper.bind*(1+this.helper.k/this.kMain));let r=e.damper;this.dmp={cBumpSlow:r.bumpSlow*t,cBumpFast:r.bumpFast*t,cReboundSlow:r.reboundSlow*t,cReboundFast:r.reboundFast*t,vKneeBump:r.kneeVelocityBump,vKneeRebound:r.kneeVelocityRebound},this.bump=e.bumpStop,this.kStrap=e.strapStiffness??8e5,this.cStrap=e.strapDamping??4e3,this.kEnd=e.endStopStiffness??2e6,this.cEnd=e.endStopDamping??15e3,this.arb=e.antiRollBar,this.camberGain=(e.camberGainDegPerM??0)*Math.PI/180,this.toeGain=(e.toeBumpSteerDegPerM??0)*Math.PI/180,this.staticCamber=(e.staticCamberDeg??0)*Math.PI/180,this.staticToe=(e.staticToeDeg??0)*Math.PI/180}springForce(e){let t=Math.max(e,0),n;return n=this.helper?t<this.zBind?this.kMain*this.helper.k/(this.kMain+this.helper.k)*t:this.kMain*(t-this.helper.bind):this.kMain*t,Math.max(0,this.preload+n)}springRate(e){return this.helper&&e<this.zBind?this.kMain*this.helper.k/(this.kMain+this.helper.k):this.kMain}damperForce(e,t=1){let n=this.dmp,r;if(e>=0)r=n.cBumpSlow*Math.min(e,n.vKneeBump)+n.cBumpFast*Math.max(0,e-n.vKneeBump);else{let t=-e;r=-(n.cReboundSlow*Math.min(t,n.vKneeRebound)+n.cReboundFast*Math.max(0,t-n.vKneeRebound))}return r*t}bumpStopForce(e,t=0){let n=this.bump,r=e-(this.travel-n.length);return r<=0?0:n.rate*r+n.progressive*r*r+(t>0?(n.damping??0)*t:0)}endStopForce(e,t=0){return e>this.travel?this.kEnd*(e-this.travel)+(t>0?this.cEnd*t:0):0}strapForce(e,t){return e>=0?0:this.kStrap*e+(t<0?this.cStrap*t:0)}cornerForce(e,t,n=1,r={}){let i=this.springForce(e),a=this.damperForce(t,n),o=this.bumpStopForce(e,t)+this.endStopForce(e,t)+this.strapForce(e,t);return r.spring=i,r.damper=a,r.bump=o,r.total=i+a+o,r}arbForce(e,t){let n=this.arb;return!n||!(n.stiffness>0)?0:n.stiffness*(e-t)/(n.armLength*n.armLength)}staticCompression(e){if(e<=this.springForce(0))return 0;let t=0,n=this.travel;for(let r=0;r<60;r++){let r=.5*(t+n);this.springForce(r)+this.bumpStopForce(r)<e?t=r:n=r}return .5*(t+n)}camberAt(e,t){return this.staticCamber+this.camberGain*(e-t)}toeAt(e,t){return this.staticToe+this.toeGain*(e-t)}},_d=class{constructor(e){this.cfg=e}loads(e,t){let n=this.cfg,r=t.pressure/(ql*t.temperature),i=.5*r,a=Math.hypot(e.x,e.y,e.z),o=i*n.dragArea*a*e.x,s=i*n.sideArea*a*e.z,c=-i*n.liftArea*a*a,l=n.downforceBalance;return{fx:o,fy:c,fz:s,downforceFront:-c*l,downforceRear:-c*(1-l),rho:r,dynamicPressure:i*a*a}}},vd=0,yd=1,bd=2,xd=3,Sd=[`FL`,`FR`,`RL`,`RR`],Cd=[-.55,0,.55],wd=[0],Td=class extends Error{constructor(e){super(e),this.name=`PhysicsStateError`}},Ed=class{constructor(e,t,n,r,i={}){this.cfg=e,this.surfaces=n,this.ambient={pressure:r.pressure,temperature:r.temperature};let a=e.wheelbase,o=e.unsprungMass.front,s=e.unsprungMass.rear,c=e.mass;if(this.totalMass=c,this.sprungMass=c-2*o-2*s,!(this.sprungMass>0))throw RangeError(`chassis: sprung mass must be positive`);let l=e.frontWeightFraction*c,u=(l-2*o)/this.sprungMass;this.b=u*a,this.a=a-this.b,this.cgHeight=e.cgHeight,this.inertia={x:e.inertia.roll,y:e.inertia.yaw,z:e.inertia.pitch},this.aero=new _d(e.aero),this.suspension={front:new gd(e.suspension.front),rear:new gd(e.suspension.rear)};let d=t[i.compoundFront??e.tires.front],f=t[i.compoundRear??e.tires.rear];if(!d||!f)throw RangeError(`unknown tyre compound (${i.compoundFront??e.tires.front} / ${i.compoundRear??e.tires.rear})`);let p=i.pressureFrontKPa??e.tires.pressureKPa.front,m=i.pressureRearKPa??e.tires.pressureKPa.rear;this.wheels=[],[{name:`FL`,x:this.a,side:-1,axle:`front`,track:e.trackFront,comp:d,p,mu:o},{name:`FR`,x:this.a,side:1,axle:`front`,track:e.trackFront,comp:d,p,mu:o},{name:`RL`,x:-this.b,side:-1,axle:`rear`,track:e.trackRear,comp:f,p:m,mu:s},{name:`RR`,x:-this.b,side:1,axle:`rear`,track:e.trackRear,comp:f,p:m,mu:s}].forEach((e,t)=>{let n=this.suspension[e.axle],r=new hd(e.comp,{pressureKPa:e.p,ambientK:this.ambient.temperature}),i=e.axle===`front`?l*Gl/2:(c-l)*Gl/2,a=i-e.mu*Gl,o=n.staticCompression(a),s=i/r.verticalStiffness(),u=e.comp.radius-s-this.cgHeight;this.wheels.push({index:t,name:e.name,side:e.side,axle:e.axle,x:e.x,zPos:e.side*e.track*.5,susp:n,tire:r,unsprungMass:e.mu,radius:e.comp.radius,inertia:e.comp.wheelInertia,z0:o,z:o,zdot:0,hubY0:u,omega:0,angle:0,steer:0,toeDamage:0,damperHealth:1,staticLoad:i,contact:!1,fn:0,fx:0,fy:0,mz:0,resist:0,patch:{x:0,y:0,z:0},camber:0,toe:0,slipRatio:0,slipAngle:0,gu:0,fs:0,suspOut:{spring:0,damper:0,bump:0,total:0},arb:0,surface:{},rollingMoment:0,impactEnergy:0,shockImpulse:0,tireDeflection:0,bodyPosWorld:{x:0,y:0,z:0},normal:{x:0,y:1,z:0},heading:{x:1,y:0,z:0},rightAxis:{x:0,y:0,z:1},terrainSample:null})}),this.position=Q.create(0,this.cgHeight,0),this.quaternion=$.identity(),this.velocity=Q.create(),this.angularVelocity=Q.create(),this.steerAngle=0,this.steerCommand=0,this.steeringTorque=0,this.accelWorld=Q.create(),this.specificForce=Q.create(),this.underbody={force:0,energy:0,contact:!1},this.aeroOut=null,this._F=Q.create(),this._T=Q.create(),this._ang=Q.create(),this.tickImpacts=[],this.hullHits=[],this.limited=!1}get wheelbase(){return this.cfg.wheelbase}placeOnTerrain(e,t,n,r,i=0){let a=e.sample(t,n,0),o=Q.normalize({x:a.nx,y:a.ny,z:a.nz},{x:0,y:1,z:0}),s={x:Math.sin(r),y:0,z:-Math.cos(r)},c=Q.normalize(Q.reject(s,o),s);this.quaternion=$.lookAlong(c,o),this.position=Q.create(t+o.x*this.cgHeight,a.height+o.y*this.cgHeight,n+o.z*this.cgHeight),this.velocity=Q.scale(c,i),this.angularVelocity=Q.create(),this.steerAngle=0;for(let e of this.wheels)e.z=e.z0,e.zdot=0,e.omega=i/e.radius,e.angle=0,e.steer=0,e.tire.reset()}settle(e,t,n=.002){let r=[0,0,0,0];for(let i=0;i<t;i+=n)this.computeForces(n,{steer:0},e),this.integrate(n,r,r)}_wheelSteer(e){if(e.axle!==`front`)return 0;let t=this.cfg.steering,n=this.steerAngle;if(Math.abs(n)<1e-9)return 0;let r=this.cfg.wheelbase,i=Math.tan(n),a=Math.atan(r*i/(r+e.zPos*i));return n+t.ackermann*(a-n)}computeForces(e,t,n,r={}){let i=this.cfg,a=i.steering,o=this.quaternion,s=$.toBasis(o),c=s.y,l=this.angularVelocity,u=$.rotate(o,l),d=Q.dot(this.velocity,s.x),f=1-a.speedReduction*X(Math.abs(d)/a.speedReductionRef,0,1);this.steerCommand=X(t.steer??0,-1,1);let p=-this.steerCommand*(a.maxWheelAngleDeg*Math.PI/180)*f;this.steerAngle=lu(this.steerAngle,p,a.rate*e);let m=0,h=-this.sprungMass*Gl,g=0,_=0,v=0,y=0,b=(e,t)=>{m+=e.x,h+=e.y,g+=e.z,_+=t.y*e.z-t.z*e.y,v+=t.z*e.x-t.x*e.z,y+=t.x*e.y-t.y*e.x};this.tickImpacts.length=0,this.steeringTorque=0;let x=this.ambient;for(let e of this.wheels)e.susp.cornerForce(e.z,e.zdot,e.damperHealth,e.suspOut);for(let[e,t]of[[vd,yd],[bd,xd]]){let n=this.wheels[e],r=this.wheels[t],i=n.susp.arbForce(n.z,r.z);n.arb=i,r.arb=-i}for(let t of this.wheels){let r=t.susp;t.fs=t.suspOut.total+t.arb;let a={x:t.x,y:t.hubY0+(t.z-t.z0),z:t.zPos},l=$.rotate(o,a),d=Q.add(this.position,l),f=Q.add(Q.add(this.velocity,Q.cross(u,l)),Q.scale(c,t.zdot));t.bodyPosWorld=d,b(Q.scale(c,t.fs),l);let p=Q.normalize({x:s.x.x,y:0,z:s.x.z},{x:1,y:0,z:0}),m=null,h=null,g=0,S=-1/0,C=n.envelope===!1?wd:Cd;for(let e=0;e<C.length;e++){let r=C[e]*t.radius,i=d.x+p.x*r,a=d.z+p.z*r,o=n.sample(i,a,t.index,d.y),s=Q.normalize({x:o.nx,y:o.ny,z:o.nz},{x:0,y:1,z:0}),c=(d.x-i)*s.x+(d.y-o.height)*s.y+(d.z-a)*s.z,l=t.radius-c;l>S&&(S=l,m=o,h=s,g=c)}t.terrainSample=m,t.tireDeflection=Math.max(S,0),t.impactEnergy=0,t.shockImpulse=0,t.camber=r.camberAt(t.z,t.z0),t.toe=r.toeAt(t.z,t.z0)*t.side+t.toeDamage,t.steer=this._wheelSteer(t);let w=t.steer+t.toe,T=Math.cos(t.camber),E=Math.sin(t.camber),D={x:T*Math.sin(w),y:-t.side*E,z:T*Math.cos(w)},O=$.rotate(o,D);if(S>0){t.contact=!0;let n=-Q.dot(f,h),r=t.tire,a=r.cfg,o=r.verticalStiffness(),s=o*S+a.verticalDamping*n;S>a.bottomOutDeflection&&(s+=12*o*(S-a.bottomOutDeflection)),s=X(s,0,i.limits?.maxTireLoad??9e4),t.fn=s;let l=Q.normalize(Q.reject(O,h),c),u=Q.cross(h,l);t.heading=u,t.rightAxis=l,t.normal=h;let p=Q.dot({x:O.x*t.side,y:O.y*t.side,z:O.z*t.side},h),C=Math.asin(X(-p,-1,1)),w=t.side*C,T=Q.dot(f,u),E=Q.dot(f,l),D=t.radius-S/3,k=t.radius-S;this.surfaces.resolve(m.layers,r.cfg.surfaceGrip,x.temperature,t.surface);let A=Math.hypot(this.velocity.x,this.velocity.z),j=r.step(e,{fz:s,vcx:T,vcy:E,omega:t.omega,re:D,camber:w,surface:t.surface,airSpeed:A});t.fx=j.fx,t.fy=j.fy,t.mz=j.mz,t.rollingMoment=j.rollingMoment,t.slipRatio=j.kappa,t.slipAngle=Math.atan(j.tanAlpha),t.resist=-j.fx*k-j.rollingMoment;let M={x:s*h.x+j.fx*u.x+j.fy*l.x,y:s*h.y+j.fx*u.y+j.fy*l.y,z:s*h.z+j.fx*u.z+j.fy*l.z},N=Q.dot(M,c);t.gu=N;let P=Q.addScaled(M,c,-N),ee=Q.addScaled(d,h,-g);t.patch=ee,b(P,Q.sub(ee,this.position)),_+=h.x*j.mz,v+=h.y*j.mz,y+=h.z*j.mz,t.axle===`front`&&(this.steeringTorque+=j.mz);let F=3.2*t.staticLoad;s>F&&(t.shockImpulse=(s-F)*e)}else t.contact=!1,t.fn=0,t.gu=0,t.fx=0,t.fy=0,t.mz=0,t.rollingMoment=0,t.slipRatio=0,t.slipAngle=0,t.resist=0,t.patch=Q.addScaled(d,c,-t.radius),this.surfaces.resolve(m.layers,t.tire.cfg.surfaceGrip,x.temperature,t.surface),t.tire.step(e,{fz:0,vcx:0,vcy:0,omega:t.omega,re:t.radius,camber:0,surface:t.surface,airSpeed:Math.hypot(this.velocity.x,this.velocity.z)});t.suspOut.bump>0&&t.zdot>0&&(t.impactEnergy=t.suspOut.bump*t.zdot*e)}let S=r.wind??{x:0,y:0,z:0},C=Q.sub(S,this.velocity),w=$.rotateInv(o,C),T=this.aero.loads(w,x);this.aeroOut=T;let E=i.aero.dragHeight??0;b($.rotate(o,{x:T.fx,y:0,z:T.fz}),$.rotate(o,{x:0,y:E,z:0})),b($.rotate(o,{x:0,y:-T.downforceFront,z:0}),$.rotate(o,{x:this.a,y:0,z:0})),b($.rotate(o,{x:0,y:-T.downforceRear,z:0}),$.rotate(o,{x:-this.b,y:0,z:0}));let D=i.underbody;this.underbody.force=0,this.underbody.energy=0,this.underbody.contact=!1;for(let t of[D.frontX,D.rearX]){let r={x:t,y:-(this.cgHeight-D.groundClearance),z:0},i=$.rotate(o,r),a=Q.add(this.position,i),s=n.sample(a.x,a.z,4,a.y),c=Q.normalize({x:s.nx,y:s.ny,z:s.nz},{x:0,y:1,z:0}),l=-((a.y-s.height)*c.y);if(l>0){let t=Q.add(this.velocity,Q.cross(u,i)),n=Q.dot(t,c),r=Math.max(0,D.stiffness*l-D.damping*n),a=Q.reject(t,c),o=Q.length(a),s=Q.scale(a,-D.friction*r/Math.max(o,.5));b(Q.add(Q.scale(c,r),s),i),this.underbody.force+=r,this.underbody.contact=!0,this.underbody.energy+=r*Math.max(0,-n)*e}}this.hullHits.length=0;let O=i.hull;if(O){let t=0;for(let e of this.wheels)e.contact&&t++;if(c.y<.75||t===0||this.underbody.contact)for(let t of O.points){let r=$.rotate(o,t),i=Q.add(this.position,r),a=n.sample(i.x,i.z,5,i.y),s=Q.normalize({x:a.nx,y:a.ny,z:a.nz},{x:0,y:1,z:0}),c=-((i.y-a.height)*s.y);if(c>0){let n=Q.add(this.velocity,Q.cross(u,r)),i=Q.dot(n,s),a=Math.max(0,O.stiffness*c-O.damping*i),o=Q.reject(n,s),l=Q.length(o),d=Q.scale(o,-O.friction*a/Math.max(l,.5));b(Q.add(Q.scale(s,a),d),r),this.hullHits.push({name:t.name,zone:t.zone,force:a,energy:a*Math.max(0,-i)*e})}}}this._F.x=m,this._F.y=h,this._F.z=g,this._T.x=_,this._T.y=v,this._T.z=y}integrate(e,t,n){let r=this.quaternion,i=$.toBasis(r).y,a=this.inertia,o=this.sprungMass,s=this._F,c=this._T,l=Q.scale(s,1/o),u=$.rotateInv(r,c),d=this.angularVelocity,f={x:(a.z-a.y)*d.y*d.z,y:(a.x-a.z)*d.z*d.x,z:(a.y-a.x)*d.x*d.y},p={x:(u.x-f.x)/a.x,y:(u.y-f.y)/a.y,z:(u.z-f.z)/a.z},m=$.rotate(r,d),h=$.rotate(r,p),g=Q.add(l,{x:0,y:Gl,z:0});this.specificForce=$.rotateInv(r,g),this.accelWorld=l;for(let t of this.wheels){let n={x:t.x,y:t.hubY0+(t.z-t.z0),z:t.zPos},a=$.rotate(r,n),o=Q.add(Q.add(l,Q.cross(h,a)),Q.cross(m,Q.cross(m,a))),s=t.unsprungMass,c=(t.gu-t.fs-s*Gl*i.y)/s-Q.dot(o,i);t.zdot+=c*e,t.z+=t.zdot*e;let u=t.susp.travel+.05,d=-.05;t.z>u?(t.z=u,t.zdot>0&&(t.zdot=0)):t.z<d&&(t.z=d,t.zdot<0&&(t.zdot=0))}for(let r=0;r<4;r++){let i=this.wheels[r],a=t[r]+i.resist,o=Math.max(0,n[r]),s=i.inertia,c=i.omega;if(Math.abs(c)<1e-9&&Math.abs(a)<=o)c=0;else{let t=c+e*(a-o*Math.sign(c===0?a:c))/s;c!==0&&Math.sign(t)!==Math.sign(c)&&(t=Math.abs(a)<=o?0:e*(a-o*Math.sign(a))/s),c=t}i.omega=c,i.angle+=c*e,(i.angle>1e6||i.angle<-1e6)&&(i.angle%=Math.PI*2)}this.velocity=Q.addScaled(this.velocity,l,e),this.angularVelocity=Q.addScaled(this.angularVelocity,p,e),this.limited=!1;let _=this.cfg.limits;if(_){let e=Q.length(this.velocity);e>_.maxSpeed&&(this.velocity=Q.scale(this.velocity,_.maxSpeed/e),this.limited=!0);let t=Q.length(this.angularVelocity);t>_.maxAngularRate&&(this.angularVelocity=Q.scale(this.angularVelocity,_.maxAngularRate/t),this.limited=!0)}this.position=Q.addScaled(this.position,this.velocity,e);let v=$.fromRotationVector(Q.scale(this.angularVelocity,e));this.quaternion=$.normalize($.mul(this.quaternion,v))}assertFinite(e=``){if(!Q.isFinite(this.position)||!Q.isFinite(this.velocity)||!Q.isFinite(this.angularVelocity)||!Number.isFinite(this.quaternion.w)||this.wheels.some(e=>!Number.isFinite(e.z)||!Number.isFinite(e.zdot)||!Number.isFinite(e.omega)))throw new Td(`non-finite chassis state ${e}`.trim())}applyImpulse(e,t){let n=this.sprungMass+this.wheels.reduce((e,t)=>e+t.unsprungMass,0),r=.5*n*Q.lengthSq(this.velocity);this.velocity=Q.addScaled(this.velocity,t,1/n);let i=Q.sub(e,this.position),a=Q.cross(i,t),o=$.rotateInv(this.quaternion,a);this.angularVelocity={x:this.angularVelocity.x+o.x/this.inertia.x,y:this.angularVelocity.y+o.y/this.inertia.y,z:this.angularVelocity.z+o.z/this.inertia.z};let s=.5*n*Q.lengthSq(this.velocity);return Math.abs(r-s)}get forwardSpeed(){return Q.dot(this.velocity,$.rotate(this.quaternion,{x:1,y:0,z:0}))}get speed(){return Q.length(this.velocity)}get attitude(){let e=$.toBasis(this.quaternion);return{heading:Math.atan2(e.x.x,-e.x.z),pitch:Math.asin(X(e.x.y,-1,1)),roll:Math.asin(X(-e.z.y,-1,1))}}getState(){return{position:{...this.position},quaternion:{...this.quaternion},velocity:{...this.velocity},angularVelocity:{...this.angularVelocity},steerAngle:this.steerAngle,wheels:this.wheels.map(e=>({z:e.z,zdot:e.zdot,omega:e.omega,angle:e.angle,toeDamage:e.toeDamage,damperHealth:e.damperHealth,tire:e.tire.getState()}))}}setState(e){this.position={...e.position},this.quaternion={...e.quaternion},this.velocity={...e.velocity},this.angularVelocity={...e.angularVelocity},this.steerAngle=e.steerAngle,e.wheels.forEach((e,t)=>{let n=this.wheels[t];n.z=e.z,n.zdot=e.zdot,n.omega=e.omega,n.angle=e.angle,n.toeDamage=e.toeDamage,n.damperHealth=e.damperHealth,n.tire.setState(e.tire)})}},Dd=5.670374419e-8,Od=class{constructor(e,t,n){this.cfg=e,this.t=t,this.ambientK=n,this.padMu=new ed(t.padFrictionByTemp,{smooth:!0,label:`brakes.padFrictionByTemp`}),this.reset()}reset(){let e=this.ambientK;this.pedal=0,this.discK=[e,e,e,e],this.fluidK=[e,e,e,e],this.padWear=[0,0,0,0],this.torque=[0,0,0,0],this.fade=[1,1,1,1],this.health=[1,1,1,1],this.power=[0,0,0,0]}update(e,t){let n=this.cfg,r=this.t;this.pedal=cu(this.pedal,Z(t.brake),r.pedalResponseTime,e);let i=n.frontBias,a=X(t.bias??i,.3,.85),o=a/i,s=(1-a)/(1-i),c=[n.maxTorqueFront/2*o,n.maxTorqueFront/2*o,n.maxTorqueRear/2*s,n.maxTorqueRear/2*s],l=Z(t.handbrake??0)*n.handbrakeTorqueRear/2,u=Math.max(t.speed,0);for(let n=0;n<4;n++){let i=n<2,a=.5*su(.8,1,this.padWear[n]),o=this.padMu.eval(this.discK[n]),s=1-r.fluidFade*su(r.fluidBoilK-20,r.fluidBoilK+25,this.fluidK[n]);this.fade[n]=Z(o*s*(1-a))*this.health[n];let d=(this.pedal*c[n]+(i?0:l))*this.fade[n];this.torque[n]=d;let f=d*Math.abs(t.omega[n]);this.power[n]=f;let p=(i?r.discMass.front:r.discMass.rear)*r.discSpecificHeat,m=this.discK[n],h=(r.coolingBase+r.coolingSpeed*u**.8)*(m-this.ambientK),g=r.radiativeArea*Dd*(m**4-this.ambientK**4);this.discK[n]=X(m+e*(f-h-g)/p,this.ambientK-5,1400);let _=this.ambientK+r.fluidCoupling*(this.discK[n]-this.ambientK);this.fluidK[n]=cu(this.fluidK[n],_,r.fluidTimeConstant,e),this.padWear[n]=Z(this.padWear[n]+f*e*r.padWearPerJoule)}return this.torque}getState(){return{pedal:this.pedal,discK:this.discK.slice(),fluidK:this.fluidK.slice(),padWear:this.padWear.slice(),torque:this.torque.slice(),fade:this.fade.slice(),health:this.health.slice(),power:this.power.slice()}}setState(e){for(let t of Object.keys(e))this[t]=Array.isArray(e[t])?e[t].slice():e[t]}},kd=class{constructor(e,t,n,r,i={}){this.config=e,this.surfacesLib=t,this.ambient=n,this.terrain=r,this.chassis=new Ed(e.chassis,e.tires.compounds,t,n,i),this.drivetrain=new fd(e.drivetrain,e.engine,n),this.brakes=new Od(e.chassis.brakes,e.damage.brakes,n.temperature),this.damage=null,this.evolution=null,this._prev={shiftUp:!1,shiftDown:!1,gear:null},this.lastInput={},this._wheelStates=[0,1,2,3].map(()=>({omega:0,inertia:1,resist:0})),this._brakeOmega=[0,0,0,0]}step(e,t,n={}){let r=this.chassis,i=this.drivetrain;this.lastInput=t,t.shiftUp&&!this._prev.shiftUp&&i.shiftUp(),t.shiftDown&&!this._prev.shiftDown&&i.shiftDown(),t.gear!==void 0&&t.gear!==null&&t.gear!==this._prev.gear&&i.selectGear(t.gear),this._prev.shiftUp=!!t.shiftUp,this._prev.shiftDown=!!t.shiftDown,this._prev.gear=t.gear??null,r.computeForces(e,{steer:t.steer??0},this.terrain,n);for(let e=0;e<4;e++)this._brakeOmega[e]=r.wheels[e].omega;let a=this.brakes.update(e,{brake:t.brake??0,handbrake:t.handbrake??0,bias:t.brakeBias,omega:this._brakeOmega,speed:r.speed}),o=this._wheelStates;for(let e=0;e<4;e++){let t=r.wheels[e];o[e].omega=t.omega,o[e].inertia=t.inertia,o[e].resist=t.resist-a[e]*Math.tanh(t.omega/1)}let s=this.damage,c=s&&s.engineSeized?{...t,ignition:!1}:t,l=i.step(e,c,o,{speed:r.forwardSpeed,intercoolerBlockage:s?s.intercoolerBlockage:0,powerScale:s?s.enginePowerScale:1,boostLeakScale:s?s.boostLeakScale:1,coolantK:s?s.coolantK:360});r.integrate(e,l,a),r.assertFinite(`(after integrate)`),s&&s.update(e,this,n),this.evolution&&this.evolution.update(e,this)}setAmbient(e,t){this.ambient.pressure=e,this.ambient.temperature=t;let n=this.drivetrain.engine;n.ambient.pressure=e,n.ambient.temperature=t,n.turbo.ambient.pressure=e,n.turbo.ambient.temperature=t,this.chassis.ambient.pressure=e,this.chassis.ambient.temperature=t;for(let e of this.chassis.wheels)e.tire.ambientK=t}resetDrivetrain(){this.drivetrain.reset(),this.brakes.reset()}getState(){return{chassis:this.chassis.getState(),drivetrain:this.drivetrain.getState(),brakes:this.brakes.getState(),prev:{...this._prev}}}setState(e){this.chassis.setState(e.chassis),this.drivetrain.setState(e.drivetrain),this.brakes.setState(e.brakes),this._prev={...e.prev}}},Ad=class extends Error{constructor(e){super(`Invalid configuration:\n${e.map(e=>`  ${e}`).join(`
`)}`),this.name=`ConfigError`,this.errors=e}},jd=[`engine`,`drivetrain`,`chassis`,`tires`,`surfaces`,`damage`,`simulation`];function Md(e){let t=[],n=[];for(let n of jd)e[n]||t.push(`missing config section "${n}"`);if(t.length)return{errors:t,warnings:n};let r=(e,n)=>{typeof e==`number`&&Number.isFinite(e)&&e>0||t.push(`${n} must be a positive number (got ${e})`)},i=e.simulation;r(i.dt,`simulation.dt`),i.dt>.01?t.push(`simulation.dt = ${i.dt} is too large for stable suspension/tyre integration (max 0.01 s)`):i.dt>.004&&n.push(`simulation.dt = ${i.dt}: above 4 ms accuracy degrades`),r(i.ambient?.pressure,`simulation.ambient.pressure`),r(i.ambient?.temperature,`simulation.ambient.temperature`);let a=e.chassis;r(a.mass,`chassis.mass`),r(a.wheelbase,`chassis.wheelbase`),r(a.trackFront,`chassis.trackFront`),r(a.trackRear,`chassis.trackRear`),r(a.cgHeight,`chassis.cgHeight`),a.frontWeightFraction>.2&&a.frontWeightFraction<.8||t.push(`chassis.frontWeightFraction must be in (0.2, 0.8)`);for(let e of[`front`,`rear`]){let n=a.suspension?.[e];n?(r(n.springRate,`chassis.suspension.${e}.springRate`),r(n.travel,`chassis.suspension.${e}.travel`),r(n.motionRatio,`chassis.suspension.${e}.motionRatio`),n.bumpStop&&n.bumpStop.length>=n.travel&&t.push(`chassis.suspension.${e}.bumpStop.length must be shorter than travel`),n.antiRollBar&&n.antiRollBar.stiffness>0&&r(n.antiRollBar.armLength,`chassis.suspension.${e}.antiRollBar.armLength`)):t.push(`chassis.suspension.${e} missing`)}for(let n of[`front`,`rear`]){let r=a.tires?.[n];e.tires.compounds?.[r]||t.push(`chassis.tires.${n} refers to unknown compound "${r}"`)}let o=e.drivetrain;if([`AWD`,`RWD`,`FWD`].includes(o.layout)||t.push(`drivetrain.layout must be AWD, RWD or FWD (got ${o.layout})`),!Array.isArray(o.transmission?.gearRatios)||o.transmission.gearRatios.length<1)t.push(`drivetrain.transmission.gearRatios must be a non-empty array`);else{o.transmission.gearRatios.forEach((e,t)=>r(e,`drivetrain.transmission.gearRatios[${t}]`));for(let e=1;e<o.transmission.gearRatios.length;e++)o.transmission.gearRatios[e]>=o.transmission.gearRatios[e-1]&&n.push(`gear ratio ${e+1} is not lower than gear ${e}`)}[`sequential`,`hpattern`].includes(o.transmission?.type)||t.push(`drivetrain.transmission.type must be "sequential" or "hpattern"`),r(o.finalDrive?.front,`drivetrain.finalDrive.front`),r(o.finalDrive?.rear,`drivetrain.finalDrive.rear`);for(let e of[`centerDiff`,`frontDiff`,`rearDiff`])[`open`,`locked`,`lsd`,`viscous`].includes(o[e]?.type)||t.push(`drivetrain.${e}.type must be open | locked | lsd | viscous`);o.centerDiff&&!(o.centerDiff.baseSplit>0&&o.centerDiff.baseSplit<1)&&t.push(`drivetrain.centerDiff.baseSplit must be in (0, 1)`);let s=e.engine.engine;r(s?.displacement,`engine.engine.displacement`),r(s?.inertia,`engine.engine.inertia`),s?.idleRpm>s?.stallRpm||t.push(`engine.engine.idleRpm must exceed stallRpm`),e.engine.ecu?.revLimiter&&!(e.engine.ecu.revLimiter.rpm>s?.idleRpm)&&t.push(`ecu.revLimiter.rpm must exceed idleRpm`);try{let i=new fu(e.surfaces);for(let[a,o]of Object.entries(e.tires.compounds)){for(let e of i.categories)o.surfaceGrip?.[e]===void 0&&n.push(`tyre ${a} has no surfaceGrip for category "${e}" (defaults to 1)`);r(o.radius,`tires.${a}.radius`),r(o.nominalLoad,`tires.${a}.nominalLoad`),[`pacejka`,`brush`].includes(o.model)||t.push(`tires.${a}.model must be pacejka or brush`)}}catch(e){t.push(e.message)}return{errors:t,warnings:n}}function Nd(e){let{errors:t,warnings:n}=Md(e);if(t.length)throw new Ad(t);return n}var Pd=`ea-rally/telemetry@1`,Fd=e=>e-$l,Id=e=>Number.isFinite(e)?e:0;function Ld(e){let t=e.vehicle,n=t.chassis,r=t.drivetrain,i=r.engine,a=r.transmission,o=n.attitude,s=n.speed,c=n.specificForce,l=n.angularVelocity,u=i.out??{},d=i.turbo,f=t.damage,p=n.wheels.map((e,n)=>{let i=e.terrainSample;return{name:Sd[n],contact:e.contact,omega:Id(e.omega),rpm:Id(e.omega*nu),rimSpeedKph:Id(e.omega*e.radius*3.6),slipRatio:Id(e.slipRatio),slipAngleDeg:Id(ou(e.slipAngle)),load:Id(e.fn),fx:Id(e.fx),fy:Id(e.fy),aligningMoment:Id(e.mz),steerDeg:ou(e.steer),camberDeg:ou(e.camber),toeDeg:ou(e.toe),driveTorque:Id(r.driveTorque[n]),brakeTorque:Id(t.brakes.torque[n]),position:{...e.bodyPosWorld},tire:{surfaceTempC:Fd(e.tire.surfaceK),coreTempC:Fd(e.tire.coreK),pressureKPa:e.tire.pressurePa/1e3,wear:e.tire.wear,grip:Id(e.tire.out.gripScale),saturation:Id(e.tire.out.saturation),compound:e.tire.cfg.name??void 0},surface:{type:e.surface?.dominant??`unknown`,friction:Id(e.surface?.friction),rollingResistance:Id(e.surface?.rollingResistance),looseDepth:Id(e.surface?.looseDepth),onRoad:i?.onRoad??!0},suspension:{compression:e.z,travel:e.susp.travel,travelFraction:e.z/e.susp.travel,velocity:e.zdot,springForce:e.suspOut.spring,damperForce:e.suspOut.damper,bumpStopForce:e.suspOut.bump,antiRollForce:e.arb,totalForce:e.fs,damperHealth:e.damperHealth},brake:{discTempC:Fd(t.brakes.discK[n]),fade:t.brakes.fade[n],padWear:t.brakes.padWear[n],fluidTempC:Fd(t.brakes.fluidK[n])}}}),m=e.stage?{id:e.stage.id,distance:e.runtime.s,lateralOffset:e.runtime.c,progress:e.runtime.progress,remaining:e.runtime.distanceRemaining,onRoad:e.runtime.onRoad,offCourse:e.runtime.offCourse,elapsed:e.runtime.elapsed,finished:e.runtime.finished,splits:e.runtime.splits.map(e=>({...e})),upcoming:e.pacenotePlayer.upcoming(e.runtime.s,3).map(e=>({id:e.id,text:e.text,distance:e.distance})),speaking:e.pacenotePlayer.current?e.pacenotePlayer.current.text:null}:null;return{schema:Pd,seq:e.seq,tick:e.tick,time:e.time,dt:e.dt,vehicle:{position:{...n.position},quaternion:{...n.quaternion},velocity:{...n.velocity},angularVelocity:{...l},speed:s,speedKph:s*3.6,forwardSpeed:n.forwardSpeed,headingDeg:ou(o.heading),pitchDeg:ou(o.pitch),rollDeg:ou(o.roll),yawRateDegS:ou(l.y),accelG:{longitudinal:c.x/Gl,lateral:c.z/Gl,vertical:c.y/Gl},steering:{roadWheelDeg:ou(n.steerAngle),command:n.steerCommand,torque:n.steeringTorque},aero:n.aeroOut?{dragForce:-n.aeroOut.fx,downforce:-n.aeroOut.fy,dynamicPressure:n.aeroOut.dynamicPressure,airDensity:n.aeroOut.rho}:null,underbodyContact:n.underbody.contact,odometer:e.odometer},engine:{rpm:i.rpm,torque:Id(i.torque),power:Id(i.torque*i.omega),throttlePlate:i.thetaPlate,running:i.running,stalled:i.stalled,limiter:!!u.limiterActive,fuelCut:!!u.fuelCut,launchControl:!!u.launchActive,antiLag:!!u.alsActive,ignitionRetardDeg:Id(u.ignitionRetardDeg),manifoldKPa:i.manifoldPa/1e3,intakeTempC:Fd(i.intakeTempK),exhaustTempC:Fd(i.exhaustTempK),fuelFlow:i.mdotFuel,airFlow:i.mdotAir,boost:{gaugeKPa:d.boostGaugePa/1e3,targetKPa:Id(u.boostTargetKPa),turboRpm:d.omega*nu,wastegate:d.wgOpen,wastegateDuty:Id(u.wastegateDuty),blowOff:d.bovOpen,surge:d.surge,pressureRatio:d.pressureRatio,turbineExpansionRatio:d.pressureRatioTurbine}},drivetrain:{layout:r.layout,gear:a.gear,gearName:a.gearName,gearRatio:a.ratio,shifting:a.shifting,clutch:{pedal:r.telemetry.clutchPedal??0,torque:Id(r.clutch.torque),slipRadS:Id(r.clutch.slipSpeed),slipping:r.clutch.slipping,capacity:Id(r.clutch.capacityValue),wear:r.clutch.wear,temperatureC:Fd(r.clutch.temperatureK)},gearbox:{type:a.type,wear:a.wear},driveshaftTorque:Id(r.telemetry.driveshaftTorque),centerDiff:{couplingTorque:r.centerDiff.couplingTorque,capacity:r.centerDiff.capacity===1/0?null:r.centerDiff.capacity,locked:r.centerDiff.locked,speedDiff:r.centerDiff.speedDiff,frontShare:r.frontShare},frontDiff:{couplingTorque:r.frontDiff.couplingTorque,capacity:r.frontDiff.capacity===1/0?null:r.frontDiff.capacity,locked:r.frontDiff.locked,speedDiff:r.frontDiff.speedDiff},rearDiff:{couplingTorque:r.rearDiff.couplingTorque,capacity:r.rearDiff.capacity===1/0?null:r.rearDiff.capacity,locked:r.rearDiff.locked,speedDiff:r.rearDiff.speedDiff},wheelTorque:r.driveTorque.map(Id)},wheels:p,stage:m,damage:f?f.summary(t):null,environment:{ambientPressureKPa:t.ambient.pressure/1e3,ambientTempC:Fd(t.ambient.temperature),altitude:e.altitude},inputs:{...e.inputs},events:e.pendingEvents.slice()}}function Rd(e,t=0){let n=e.vehicle.chassis,r=e._prevRender,i=Math.min(1,Math.max(0,t)),a=n.position,o=n.quaternion;r&&i<1&&(a=Q.lerp(r.position,n.position,i),o=zd(r.quaternion,n.quaternion,i));let s=n.wheels.map((e,t)=>{let n=r?.wheels[t],s=(e,t)=>n&&i<1?e+(t-e)*i:t,c=s(n?.z??e.z,e.z),l=s(n?.steer??e.steer,e.steer),u=s(n?.toe??e.toe,e.toe),d=s(n?.camber??e.camber,e.camber),f=s(n?.angle??e.angle,e.angle),p={x:e.x,y:e.hubY0+(c-e.z0),z:e.zPos};return{position:Q.add(a,$.rotate(o,p)),quaternion:$.mul($.mul($.mul(o,$.fromAxisAngle({x:0,y:1,z:0},l+u)),$.fromAxisAngle({x:1,y:0,z:0},e.side*d)),$.fromAxisAngle({x:0,y:0,z:1},-f)),spinAngle:f,steerAngle:l+u,compression:c,radius:e.radius}});return{tick:e.tick,time:e.time,alpha:i,body:{position:{...a},quaternion:{...o}},wheels:s}}function zd(e,t,n){let r=e.x*t.x+e.y*t.y+e.z*t.z+e.w*t.w,i=t.x,a=t.y,o=t.z,s=t.w;if(r<0&&(r=-r,i=-i,a=-a,o=-o,s=-s),r>.9995)return $.normalize({x:e.x+(i-e.x)*n,y:e.y+(a-e.y)*n,z:e.z+(o-e.z)*n,w:e.w+(s-e.w)*n});let c=Math.acos(r),l=Math.sin(c),u=Math.sin((1-n)*c)/l,d=Math.sin(n*c)/l;return{x:e.x*u+i*d,y:e.y*u+a*d,z:e.z*u+o*d,w:e.w*u+s*d}}var Bd=Object.freeze({throttle:0,brake:0,clutch:null,steer:0,handbrake:0,shiftUp:!1,shiftDown:!1,gear:null,ignition:!0,starter:!1,alsSwitch:!1,launchSwitch:!1,centerDiffLock:0,brakeBias:null}),Vd=class{constructor(e,t={}){this.warnings=Nd(e),this.config=e;let n=e.simulation;this.dt=n.dt,this.maxSteps=n.maxStepsPerUpdate??100,this.surfaces=new fu(e.surfaces),this.baseAmbient={pressure:n.ambient.pressure,temperature:n.ambient.temperature},this.ambient={...this.baseAmbient},this.altitudeCorrection=!!n.ambient.altitudeCorrection,this.wind={...n.wind??{x:0,y:0,z:0}},this.stage=t.stage?t.stage:t.stageJson?Vu.fromJson(t.stageJson,e.gpsStageSchema,{surfaces:this.surfaces}):null,this.evolution=null,this.stage?(n.evolution?.enabled&&(this.evolution=new Ku(this.stage.spline,this.surfaces,{rowSpacing:n.evolution.rowSpacing,columnSpacing:n.evolution.columnSpacing}),this.stage.terrain.setEvolution(this.evolution)),this.terrain=this.stage.terrain,this.runtime=new Hu(this.stage),this.pacenotePlayer=this.stage.createPacenotePlayer()):(this.terrain=new pu(n.flatTerrain??{}),this.runtime=null,this.pacenotePlayer=null),this.vehicle=new kd(e,this.surfaces,this.ambient,this.terrain,t.setup??{}),this.vehicle.damage=new Xu(e.damage,this.ambient.temperature,{seed:this.stage?.def.seed??n.seed??1}),this.vehicle.evolution=this.evolution,this.inputs={...Bd},this.tick=0,this.time=0,this.seq=0,this.odometer=0,this.altitude=0,this.accumulator=0,this.pendingEvents=[],this.eventLog=[],this.subscribers=[],this._prevRender=null,this._lastNotifyTick=0,this._originElevation=this.stage?this.stage.def.origin.elevation??0:0,this.stage?this.placeOnStage({s:0}):this.placeAt(0,0,0)}placeAt(e,t,n=0,r=0,i=.5){let a=this.vehicle.chassis;if(a.placeOnTerrain(this.terrain,e,t,n*Math.PI/180,0),i>0&&a.settle(this.terrain,i,this.dt),r!==0){let e=$.rotate(a.quaternion,{x:1,y:0,z:0});a.velocity=Q.scale(e,r)}for(let e of a.wheels)e.omega=r/e.radius,e.tire.reset();this._afterPlacement()}placeOnStage({s:e=0,lateral:t=0,speed:n=0,settleSeconds:r=.5}={}){if(!this.stage)throw Error(`no stage loaded`);let i=this.stage.startPose(e,t);this.placeAt(i.x,i.z,i.heading*180/Math.PI,n,r),this.runtime.reset(),this.pacenotePlayer.reset(),this.pacenotePlayer.next=this.pacenotePlayer.notes.findIndex(t=>t.sEnd>=e-1),this.pacenotePlayer.next<0&&(this.pacenotePlayer.next=this.pacenotePlayer.notes.length)}_afterPlacement(){this.vehicle.drivetrain.engine.omega=Math.max(this.vehicle.drivetrain.engine.omega,this.vehicle.drivetrain.engine.idleOmega),this._snapshotRender(),this._updateAmbient()}setInputs(e){for(let[t,n]of Object.entries(e)){if(!(t in Bd))throw RangeError(`unknown input "${t}"`);this.inputs[t]=n}let t=this.inputs;t.throttle=X(t.throttle,0,1),t.brake=X(t.brake,0,1),t.steer=X(t.steer,-1,1),t.handbrake=X(t.handbrake,0,1),t.centerDiffLock=X(t.centerDiffLock,0,1),t.clutch!==null&&t.clutch!==void 0&&(t.clutch=X(t.clutch,0,1))}replaceInputs(e){this.inputs={...Bd},this.setInputs(e)}_snapshotRender(){let e=this.vehicle.chassis;this._prevRender={position:{...e.position},quaternion:{...e.quaternion},wheels:e.wheels.map(e=>({z:e.z,steer:e.steer,toe:e.toe,camber:e.camber,angle:e.angle}))}}_updateAmbient(){if(!this.altitudeCorrection)return;let e=this.vehicle.chassis,t=Math.max(-200,this._originElevation+e.position.y-e.cgHeight);this.altitude=t;let n=this.baseAmbient.temperature-.0065*t,r=this.baseAmbient.pressure*(1-225577e-10*t)**5.25588;this.vehicle.setAmbient(r,n)}step(){let e=this.dt;this._snapshotRender();let t=this.vehicle;if(t.step(e,this.inputs,{wind:this.wind}),this.tick++,this.time=this.tick*e,this.odometer+=t.chassis.speed*e,this.tick%100==0&&this._updateAmbient(),this.runtime){let n=this.runtime.update(e,t.chassis.position,t.chassis.position.y);for(let e of n)this._emit(e);if(this.runtime.started){let n=this.pacenotePlayer.update(e,this.runtime.s,t.chassis.speed);for(let e of n)this._emit({type:`pacenote`,id:e.note.id,text:e.note.text,tokens:e.note.tokens,severity:e.note.severity,direction:e.note.direction,kind:e.note.type,duration:e.duration,distanceAhead:e.distanceAhead})}}for(let e of t.drivetrain.transmission.events)this._emit(e);for(let e of t.drivetrain.engine.events)this._emit(e);if(t.damage)for(let e of t.damage.events)this._emit(e);this._maybeNotify()}update(e){this.accumulator+=Math.max(0,e);let t=0;for(;this.accumulator>=this.dt&&t<this.maxSteps;)this.step(),this.accumulator-=this.dt,t++;return t===this.maxSteps&&(this.accumulator=0),this.seq++,t}run(e,t){for(let n=0;n<e;n++){if(t){let e=t(this.tick,this);e&&this.setInputs(e)}this.step()}}_emit(e){let t={tick:this.tick,time:this.time,...e};this.pendingEvents.push(t),this.eventLog.push(t),this.eventLog.length>2e3&&this.eventLog.splice(0,this.eventLog.length-2e3)}drainEvents(){let e=this.pendingEvents;return this.pendingEvents=[],e}subscribe(e,{hz:t}={}){let n=t??this.config.simulation.telemetryHz??60,r={fn:e,every:Math.max(1,Math.round(1/(n*this.dt))),last:this.tick};return this.subscribers.push(r),()=>{this.subscribers=this.subscribers.filter(e=>e!==r)}}_maybeNotify(){if(!this.subscribers.length)return;let e=null;for(let t of this.subscribers)if(!(this.tick-t.last<t.every)){t.last=this.tick,e??=this.getSnapshot();try{t.fn(e)}catch(e){this._emit({type:`subscriber_error`,message:String(e?.message??e)})}}e&&(this.pendingEvents=[])}getTelemetry(){return Ld(this)}getSnapshot(){return this.seq++,{seq:this.seq,tick:this.tick,time:this.time,hash:this.stateHash(),telemetry:Ld(this),render:Rd(this,this.accumulator/this.dt)}}getRenderState(e=this.accumulator/this.dt){return Rd(this,e)}getState({surface:e=!0}={}){return{tick:this.tick,time:this.time,odometer:this.odometer,accumulator:this.accumulator,inputs:{...this.inputs},ambient:{...this.ambient},altitude:this.altitude,vehicle:this.vehicle.getState(),damage:this.vehicle.damage.getState(),runtime:this.runtime?this.runtime.getState():null,pacenotes:this.pacenotePlayer?this.pacenotePlayer.getState():null,evolution:this.evolution&&e?this.evolution.getState():null}}setState(e){this.tick=e.tick,this.time=e.time,this.odometer=e.odometer,this.accumulator=e.accumulator,this.inputs={...e.inputs},this.altitude=e.altitude,this.vehicle.setAmbient(e.ambient.pressure,e.ambient.temperature),this.vehicle.setState(e.vehicle),this.vehicle.damage.setState(e.damage),this.runtime&&e.runtime&&this.runtime.setState(e.runtime),this.pacenotePlayer&&e.pacenotes&&this.pacenotePlayer.setState(e.pacenotes),this.evolution&&e.evolution&&this.evolution.setState(e.evolution),this.pendingEvents=[],this._snapshotRender(),this._lastNotifyTick=this.tick;for(let e of this.subscribers)e.last=this.tick}serialize(){return JSON.stringify(this.getState())}restore(e){this.setState(typeof e==`string`?JSON.parse(e):e)}stateHash({surface:e=!0}={}){let t=this.getState({surface:e}),n=e&&t.evolution!==void 0&&this.evolution?this.evolution.stateHash():``;return t.evolution=null,t.accumulator=0,du(JSON.stringify(t))+n}},Hd=e=>JSON.parse(JSON.stringify(e)),Ud=.14503774,Wd=6.894757,Gd={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10},Kd=e=>({x:e.x,y:e.y,z:-e.z}),qd=e=>({x:-e.x,y:-e.y,z:e.z,w:e.w}),Jd={tarmac:{layers:[{type:`tarmac`}],crown:.02},gravel:{layers:[{type:`gravel`,depth:.045},{type:`packed_dirt`}],crown:.025},rocky:{layers:[{type:`gravel`,depth:.015},{type:`packed_dirt`}],crown:.03},snow:{layers:[{type:`snow`,depth:.08},{type:`packed_dirt`}],crown:.02}};function Yd(e){let t=2166136261;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return(t>>>0)%2147483647}function Xd(e,t={}){let n=(e.waypoints??[]).filter(e=>Number.isFinite(e.lat)&&Number.isFinite(e.lon));if(n.length<2)throw RangeError(`stage "${e.id}" needs at least 2 waypoints with lat/lon`);let r=e.startPoint?.alt??n[0].elevation??100,i=n.map(t=>({lat:t.lat,lng:t.lon,ele:t.elevation??t.alt??r,width:t.width??e.baseRoadWidthMeters??6}));for(;i.length<4;){let e=0,t=-1;for(let n=0;n<i.length-1;n++){let r=Math.hypot(i[n+1].lat-i[n].lat,i[n+1].lng-i[n].lng);r>t&&(t=r,e=n)}let n=i[e],r=i[e+1];i.splice(e+1,0,{lat:(n.lat+r.lat)/2,lng:(n.lng+r.lng)/2,ele:(n.ele+r.ele)/2,width:(n.width+r.width)/2})}let a=Jd[e.surface]??Jd.gravel,o=0;for(let e=0;e<i.length-1;e++)o+=Math.hypot((i[e+1].lat-i[e].lat)*111320,(i[e+1].lng-i[e].lng)*111320*Math.cos(i[e].lat*Math.PI/180));o/=i.length-1;let s=o<40,c=e=>X(e,2.5,30);return{schemaVersion:`1.0`,id:String(e.id??`ui-stage`),name:String(e.name??`UI stage`),country:String(e.region??``),seed:Yd(String(e.id??`ui-stage`)),track:{lat:i.map(e=>e.lat),lng:i.map(e=>e.lng),elevation:i.map(e=>e.ele),width:i.map(e=>c(e.width))},road:{defaultWidth:c(e.baseRoadWidthMeters??i[0].width),crownSlope:a.crown,shoulderWidth:X(e.shoulderWidthMeters??1.5,0,20),defaultLayers:Hd(a.layers)},processing:s?{horizontalSmoothing:2.5,elevationSmoothing:8,curvatureSmoothing:5,verticalCurvatureSmoothing:6,apexCurvatureSmoothing:8}:{horizontalSmoothing:0,elevationSmoothing:0,curvatureSmoothing:8,verticalCurvatureSmoothing:12,apexCurvatureSmoothing:12},pacenotes:t.pacenotes===`ui`&&e.pacenotes?.length?{mode:`explicit`,severityScale:`six_easiest`,notes:e.pacenotes.map(e=>Zd(e,t.lengthScale??1))}:{mode:`auto`,severityScale:`six_easiest`}}}function Zd(e,t=1){let n=e.direction===`left`||e.direction===`right`?e.direction:null,r=`custom`;e.type===`jump`||e.type===`crest`||e.type===`dip`||e.type===`bump`?r=e.type:e.type===`hazard`?r=`caution`:n&&(r=n);let i={distance:Math.max(0,(e.distance??0)*t),type:r,modifiers:e.modifier&&e.modifier!==`none`?[String(e.modifier)]:[],text:String(e.call??r)};return Number.isInteger(e.severity)&&e.severity>=0&&(i.severity=e.severity),e.type===`hazard`&&(i.priority=2),i}var Qd={long:`Long corner`,tightens:`Tightens on exit`,opens:`Opens on exit`,caution:`Caution`,into:`Link to next`,off_camber:`Off camber`,over_crest:`Crest on entry`,dont_cut:`Don't cut`};function $d(e){let t=e.tokens.map(e=>e in Gd?String(Gd[e]):e).join(` `).replace(/^./,e=>e.toUpperCase()),n=e.type===`corner`||e.type===`hairpin`||e.type===`square`,r=e.modifiers?.[0]??(n?`none`:e.type);return{id:e.id,distance:Math.round(e.s),call:t,type:n?`turn`:e.type,severity:n?e.severity:6,direction:e.direction||`straight`,modifier:r,detail:e.modifiers?.length?e.modifiers.map(e=>Qd[e]??e).join(`, `):e.type===`hairpin`?`Hairpin`:``,apexDistance:Math.round(e.sApex??e.s)}}var ef={front:140,rear:150},tf=[[/snow|ice|stud/i,`rally_snow_studded_15`],[/gravel|dirt|rock|loose|acropolis|mud/i,`rally_gravel_15`],[/tarmac|asphalt|slick|road|wet/i,`rally_tarmac_18`]],nf=e=>.5*X(e,0,100)/100;function rf(e,t){let n=Hd(t),r={},i={applied:[],ignored:[],warnings:[],info:[]},a=(e,t,n,r)=>{if(!Number.isFinite(t))i.warnings.push(`${e}: not a number (${t}), ignored`);else return(t<n||t>r)&&(i.warnings.push(`${e}: ${t} outside [${n}, ${r}], clamped`),t=X(t,n,r)),i.applied.push(e),t},o=new Set,s=(t,n)=>(o.add(`${t}.${n}`),e?.[t]?.[n]);for(let e of[`front`,`rear`]){let t=n.chassis.suspension[e],r=e,i=s(`suspension`,`${r}SpringRate`);i!==void 0&&(i=a(`suspension.${r}SpringRate`,i,15,250),i!==void 0&&(t.springRate=i*1e3));let o=t.springRate*t.motionRatio**2;i=s(`suspension`,`${r}RideHeight`),i!==void 0&&(i=a(`suspension.${r}RideHeight`,i,80,260),i!==void 0&&(t.preload=o*(i-ef[e])/1e3));let c=s(`suspension`,`${r}BumpDamping`),l=s(`suspension`,`${r}ReboundDamping`),u=s(`suspension`,`${r}FastBumpDamping`);if(c!==void 0){let e=a(`suspension.${r}BumpDamping`,c,500,15e3);e!==void 0&&(t.damper.bumpSlow=e)}if(l!==void 0){let e=a(`suspension.${r}ReboundDamping`,l,500,2e4);e!==void 0&&(t.damper.reboundSlow=e)}if(u!==void 0){let e=a(`suspension.${r}FastBumpDamping`,u,200,12e3);e!==void 0&&(t.damper.bumpFast=e)}(c!==void 0||l!==void 0||u!==void 0)&&(t.damper.reboundFast=t.damper.reboundSlow*(t.damper.bumpFast/Math.max(t.damper.bumpSlow,1))),i=s(`suspension`,`${r}AntiRollBar`),i!==void 0&&(i=a(`suspension.${r}AntiRollBar`,i,0,400),i!==void 0&&(t.antiRollBar.stiffness=i*1e3*t.antiRollBar.armLength**2)),i=s(`suspension`,`${r}CamberDeg`),i!==void 0&&(i=a(`suspension.${r}CamberDeg`,i,-6,3),i!==void 0&&(t.staticCamberDeg=i)),i=s(`suspension`,`${r}ToeDeg`),i!==void 0&&(i=a(`suspension.${r}ToeDeg`,i,-1.5,1.5),i!==void 0&&(t.staticToeDeg=i))}e?.differential;let c=String(s(`differential`,`type`)??`lsd`).toLowerCase(),l=/open/.test(c)?`open`:/spool|locked|solid/.test(c)?`locked`:/visc/.test(c)?`viscous`:`lsd`;for(let e of[`centerDiff`,`frontDiff`,`rearDiff`])n.drivetrain[e].type=e===`centerDiff`&&n.drivetrain.layout!==`AWD`?n.drivetrain[e].type:l;let u=e=>e?.rampGain??(e?.mu&&e?.surfaces&&e?.meanRadius&&e?.rampRadius?e.mu*e.surfaces*e.meanRadius/(2*e.rampRadius):.35),d=(e,t,r,i,o)=>{let s=n.drivetrain[e],c=u(s.pack);if(t!==void 0){let e=a(`differential.${o}Accel`,t,0,100);e!==void 0&&(c=nf(e),s.powerRampDeg=45)}if(s.pack={...s.pack??{},rampGain:c},r!==void 0){let e=a(`differential.${o}Decel`,r,0,100);if(e!==void 0){let t=nf(e);s.coastRampDeg=t>1e-6?X(Math.atan(c/t)*180/Math.PI,20,89):89}}if(i!==void 0){let e=a(`differential.${o}Preload`,i,0,600);e!==void 0&&(s.preload=e)}};d(`frontDiff`,s(`differential`,`frontAccelLock`),s(`differential`,`frontDecelLock`),s(`differential`,`frontPreloadNm`),`front`),d(`rearDiff`,s(`differential`,`rearAccelLock`),s(`differential`,`rearDecelLock`),s(`differential`,`rearPreloadNm`),`rear`);let f=s(`differential`,`centerTorqueSplitFront`),p=s(`differential`,`centerTorqueSplitRear`);if(f!==void 0){let e=X(p===void 0?f/100:f/Math.max(f+p,1e-9),.1,.9);n.drivetrain.centerDiff.baseSplit=e,i.applied.push(`differential.centerTorqueSplitFront`)}let m=s(`differential`,`centerLockRatio`);if(m!==void 0){let e=a(`differential.centerLockRatio`,m,0,100);e!==void 0&&(n.drivetrain.centerDiff.pack={...n.drivetrain.centerDiff.pack??{},rampGain:nf(e)},n.drivetrain.centerDiff.powerRampDeg=45,n.drivetrain.centerDiff.coastRampDeg=60)}let h=String(s(`transmission`,`type`)??`sequential`).toLowerCase();n.drivetrain.transmission.type=/h_?pattern|manual/.test(h)?`hpattern`:`sequential`;let g=s(`transmission`,`gearRatios`);Array.isArray(g)&&g.length>=1&&g.every(e=>Number.isFinite(e)&&e>.3&&e<8)?(n.drivetrain.transmission.gearRatios=g.slice(),i.applied.push(`transmission.gearRatios`)):g!==void 0&&i.warnings.push(`transmission.gearRatios: need an array of ratios in (0.3, 8); ignored`);let _=s(`transmission`,`reverseRatio`);if(_!==void 0){let e=a(`transmission.reverseRatio`,_,1,8);e!==void 0&&(n.drivetrain.transmission.reverseRatio=e)}let v=s(`transmission`,`finalDriveRatio`);if(v!==void 0){let e=a(`transmission.finalDriveRatio`,v,2,8);e!==void 0&&(n.drivetrain.finalDrive={front:e,rear:e})}let y=s(`transmission`,`shiftTimeMs`);if(y!==void 0){let e=a(`transmission.shiftTimeMs`,y,15,600);e!==void 0&&(n.drivetrain.transmission.sequential.shiftTime=e/1e3,n.drivetrain.transmission.hPattern.shiftTime=Math.max(e/1e3,.12))}let b=s(`transmission`,`clutchFrictionTorque`);if(b!==void 0){let e=a(`transmission.clutchFrictionTorque`,b,150,3e3);e!==void 0&&(n.drivetrain.clutch.maxTorque=e)}let x=n.engine.engine,S=Math.max(...x.torqueCurve.map(e=>e[1])),C=n.engine.ecu.revLimiter.rpm,w=s(`engine`,`maxRpm`),T=s(`engine`,`idleRpm`),E=s(`engine`,`peakTorqueNm`),D=s(`engine`,`peakBoostBar`),O=s(`engine`,`antiLagSystem`);for(let e of[`displacementLiters`,`cylinders`,`aspiration`,`peakPowerBhp`,`revLimiter`,`redlineRpm`])s(`engine`,e);let k=1,A=w===void 0?void 0:a(`engine.maxRpm`,w,5e3,12e3);A!==void 0&&(k=A/C);let j=Math.max(...t.engine.ecu.boostTargetMap.z.flat()),M=1;if(D!==void 0){let e=a(`engine.peakBoostBar`,D,1,4);if(e!==void 0){let t=Math.max(0,(e-1.01325)*100),r=t/j;n.engine.ecu.boostTargetMap.z=n.engine.ecu.boostTargetMap.z.map(e=>e.map(e=>e*r)),n.engine.ecu.boostControl.overboostKPa=Math.max(n.engine.ecu.boostControl.overboostKPa,t*1.4),n.engine.turbo.wastegate.maxControlPressure=Math.max(n.engine.turbo.wastegate.maxControlPressure,t*1300),M=(101.325+t)/(101.325+j)}}let N=1,P=E===void 0?void 0:a(`engine.peakTorqueNm`,E,150,1200);P!==void 0&&(N=P/(S*M));let ee=(e,t=k,n=1)=>e.map(([e,r])=>[e*t,r*n]);if(k!==1||N!==1){x.torqueCurve=ee(x.torqueCurve,k,N),x.dynoBoostKPa=ee(x.dynoBoostKPa,k),x.volumetricEfficiency=ee(x.volumetricEfficiency,k);let e=n.engine.ecu;e.throttleMap.x=e.throttleMap.x.map(e=>e*k),e.boostTargetMap.x=e.boostTargetMap.x.map(e=>e*k),e.revLimiter.rpm=C*k,e.launch.rpm*=k,e.als.minRpm*=k,x.friction.f1/=k,x.friction.f2/=k*k,n.engine.turbo.turbine.flowCoefficient*=k,n.engine.turbo.compressor.chokeFlow*=k}if(T!==void 0){let e=a(`engine.idleRpm`,T,600,2500);e!==void 0&&(x.idleRpm=e,x.stallRpm=Math.min(x.stallRpm,e*.45))}if(O!==void 0){o.add(`engine.antiLagSystem`);let e=String(O).toLowerCase(),t=n.engine.ecu.als;e===`off`||e===`none`?t.enabled=!1:e===`mild`?(t.retardDeg=35,t.boostTargetKPa=80):e===`aggressive`&&(t.retardDeg=50,t.boostTargetKPa=130,t.throttle=.12),i.applied.push(`engine.antiLagSystem`)}if(S){let t=Math.max(...x.torqueCurve.map(([e,t])=>t*(e*Math.PI/30)))*.001341,n=e?.engine?.peakPowerBhp;Number.isFinite(n)&&Math.abs(t-n)/n>.2&&i.info.push(`engine: the scaled curve gives ~${t.toFixed(0)} bhp but peakPowerBhp is ${n}; peak torque and rpm limits are authoritative`)}let F=s(`tires_and_brakes`,`tireCompound`);if(F!==void 0){let e=tf.find(([e])=>e.test(String(F)));e?(r.compoundFront=e[1],r.compoundRear=e[1],i.applied.push(`tires_and_brakes.tireCompound`)):i.warnings.push(`tires_and_brakes.tireCompound "${F}" has no engine compound; keeping the configured one`)}let te=s(`tires_and_brakes`,`frontTirePressurePsi`),ne=s(`tires_and_brakes`,`rearTirePressurePsi`);if(te!==void 0){let e=a(`tires_and_brakes.frontTirePressurePsi`,te,10,45);e!==void 0&&(r.pressureFrontKPa=e*Wd)}if(ne!==void 0){let e=a(`tires_and_brakes.rearTirePressurePsi`,ne,10,45);e!==void 0&&(r.pressureRearKPa=e*Wd)}let re=s(`tires_and_brakes`,`brakeBiasFrontPercent`),ie=s(`tires_and_brakes`,`maxBrakeTorqueNm`),ae=s(`tires_and_brakes`,`handbrakeTorqueNm`),oe=n.chassis.brakes,se=re===void 0?void 0:a(`tires_and_brakes.brakeBiasFrontPercent`,re,40,80);if(se!==void 0&&(oe.frontBias=se/100),ie!==void 0){let e=a(`tires_and_brakes.maxBrakeTorqueNm`,ie,1e3,12e3);e!==void 0&&(oe.maxTorqueFront=e,oe.maxTorqueRear=e*(1-oe.frontBias)/oe.frontBias)}if(ae!==void 0){let e=a(`tires_and_brakes.handbrakeTorqueNm`,ae,0,12e3);e!==void 0&&(oe.handbrakeTorqueRear=e)}for(let[t,n]of Object.entries(e??{}))if(n&&typeof n==`object`){for(let e of Object.keys(n))!o.has(`${t}.${e}`)&&t!==`visual_parts`&&i.ignored.push(`${t}.${e}`);t===`visual_parts`&&i.ignored.push(`visual_parts.*`)}return{config:n,setup:r,report:i}}var af=[`fl`,`fr`,`rl`,`rr`],of=(e,t=2)=>{let n=10**t;return Math.round(e*n)/n};function sf(e,t){if(t)return 100;let n=e.capacity;return n===1/0||n<0?100:n>1e-6?X(100*Math.abs(e.couplingTorque)/n,0,100):0}function cf(e,t={}){let n=e.vehicle,r=n.chassis,i=n.drivetrain,a=i.engine,o=i.transmission,s=t.telemetry??e.getTelemetry(),c=t.uiTravelMm??280,l=r.attitude,u=s.wheels,d=t.inputs??e.inputs,f=r.specificForce,p=s.engine.boost.gaugeKPa/100,m={},h={};af.forEach((e,t)=>{let n=r.wheels[t],i=u[t],a=X(n.z/n.susp.travel,0,1),o=c/(n.susp.travel*1e3);m[e]={travelMm:of(X(c/2-(n.z-n.z0)*1e3*o,0,c),1),maxTravelMm:c,compressionPct:of(a*100,1),damperVelocityMs:of(-n.zdot*o,3),bottomedOut:n.z>n.susp.travel-.004,physical:{compressionMm:of(n.z*1e3,1),travelMm:of(n.susp.travel*1e3,1),springForce:of(n.suspOut.spring,0),damperForce:of(n.suspOut.damper,0),loadN:of(n.fn,0)}},h[e]={coreTempC:of(i.tire.coreTempC,1),surfaceTempC:of(i.tire.surfaceTempC,1),pressurePsi:of(i.tire.pressureKPa*Ud,2),slipAngleDeg:of(i.slipAngleDeg,2),slipRatio:of(i.slipRatio,3),gripUtilPct:Math.round(X(i.tire.saturation*100,0,100)),surfaceContact:i.contact,wear:of(i.tire.wear,4),surface:i.surface.type}});let g=null,_=0,v=0,y=0,b=0;if(e.stage){_=e.stage.length,v=e.runtime.s,y=e.runtime.progress*100,b=e.runtime.elapsed;let n=e.pacenotePlayer.notes.find(e=>e.sEnd>=v-5);if(n){let e=t.uiNotes?.get(n.id)??$d(n);g={call:e.call,distanceToApexM:Math.max(0,Math.round((n.sApex??n.s)-v)),severity:e.severity,direction:e.direction,modifier:e.modifier,detail:e.detail}}}let x=o.gear,S=Kd(r.position);return{timestamp:t.timestamp??0,tick:e.tick,vehicle:{speedKph:of(r.speed*3.6,1),speedMph:of(r.speed*2.236936,1),engineRpm:Math.round(a.rpm),gear:x,throttle:of(d.throttle??0,2),brake:of(d.brake??0,2),clutch:of(i.telemetry.clutchPedal??0,2),handbrake:of(d.handbrake??0,2),steeringAngleDeg:of(-r.steerAngle*180/Math.PI,1),turboBoostBar:of(p,2),peakBoostBar:of(t.peakBoostBar??p,2),antiLagActive:!!s.engine.antiLag,limiterActive:!!s.engine.limiter},gForces:{lateralG:of(f.z/Gl,2),longitudinalG:of(f.x/Gl,2),verticalG:of(f.y/Gl,2),yawRateDegS:of(-r.angularVelocity.y*180/Math.PI,1)},suspension:m,tires:h,drivetrain:{frontDiffLockPct:of(sf(i.frontDiff,i.frontDiff.type===`locked`),1),centerDiffLockPct:of(i.layout===`AWD`?sf(i.centerDiff,i.centerDiff.type===`locked`):0,1),rearDiffLockPct:of(sf(i.rearDiff,i.rearDiff.type===`locked`),1),wheelSpinRps:Object.fromEntries(af.map((e,t)=>[e,of(r.wheels[t].omega/(2*Math.PI),2)]))},stageProgress:{currentDistanceM:Math.round(v),totalDistanceM:Math.round(_),progressPercent:Math.min(100,Math.round(y)),elapsedTimeSec:of(b,1),deltaSec:0,...g?{activePacenote:g}:{}},position:S,rotation:{yawDeg:of(l.heading*180/Math.PI,3),pitchDeg:of(l.pitch*180/Math.PI,2),rollDeg:of(l.roll*180/Math.PI,2)},quaternion:qd(r.quaternion),wheelTransforms:e.getRenderState().wheels.map(e=>({position:Kd(e.position),quaternion:qd(e.quaternion),spinAngle:e.spinAngle})),damage:s.damage,stateHash:t.stateHash}}var lf=class{constructor({bridge:e,eventBus:t,RALLY_EVENTS:n,stateStore:r,config:i,options:a={}}){this.bridge=e,this.bus=t,this.EV=n,this.store=r,this.baseConfig=i,this.opt={uiTravelMm:280,autoShiftUpMargin:200,autoShiftDownRpm:2800,seed:1,pacenoteSource:`auto`,...a},this.rng=new wu(this.opt.seed),this.sim=null,this.stage=null,this.uiNotes=new Map,this.report=null,this.peakBoostBar=0,this.prev={bov:!1,bottomed:[!1,!1,!1,!1]},this.lastTelemetry=null,this.errors=[],this._offs=[],this._pendingRebuild=!1,this._stageRef=null,this.rebuild({keepPose:!1}),this._offs.push(this.bus.on(this.EV.TUNING_UPDATED,e=>{e?.section!==`visual_parts`&&(this._pendingRebuild=!0)}));let o=()=>{this._stageRef!==this.store.activeStage&&this.rebuild({keepPose:!1})};this._offs.push(this.bus.on(this.EV.STAGE_SELECTED,o)),this._offs.push(this.bus.on(this.EV.STAGE_COMPILED,o))}get redlineRpm(){return this.store.currentTuning?.engine?.redlineRpm??this.sim.config.engine.ecu.revLimiter.rpm*.93}rebuild({keepPose:e=!1}={}){let t=null;if(e&&this.sim?.stage){let e=this.sim.vehicle.chassis;t={s:this.sim.runtime.s,lateral:this.sim.runtime.c,speed:e.forwardSpeed,gear:this.sim.vehicle.drivetrain.transmission.gear}}this._pendingRebuild=!1,this._stageRef=this.store.activeStage;let n=rf(this.store.currentTuning??{},this.baseConfig);this.report=n.report;let r=null,i=null,a=this.store.activeStage;if(a?.waypoints?.length>=2)try{let e=Xd(a,{pacenotes:`engine`});r=Vu.fromJson(e,this.baseConfig.gpsStageSchema);let t=a.pacenotes?.length>0;(this.opt.pacenoteSource===`ui`||this.opt.pacenoteSource!==`engine`&&t)&&t&&(e=Xd(a,{pacenotes:`ui`,lengthScale:r.length/Math.max(1,a.totalLengthMeters??r.length)}),r=Vu.fromJson(e,this.baseConfig.gpsStageSchema),i=a.pacenotes.slice().sort((e,t)=>e.distance-t.distance))}catch(e){r=null,this.errors.push(`stage "${a?.id}": ${e.message}`),this.bus.emit?.(this.EV.NOTIFICATION,{title:`Stage error`,message:`Could not build physics stage: ${e.message}`})}return this.stage=r,this.sim=new Vd(n.config,{stage:r??void 0,setup:n.setup}),this.sim.setInputs({alsSwitch:n.config.engine.ecu.als.enabled}),this.uiNotes.clear(),r&&r.pacenotes.forEach((e,t)=>{let n=i?.[t];this.uiNotes.set(e.id,n?{...n,id:e.id,engineDistance:Math.round(e.s)}:$d(e))}),this.peakBoostBar=0,this.prev={bov:!1,bottomed:[!1,!1,!1,!1]},this.sim.vehicle.drivetrain.transmission.reset(1),t&&r&&(this.sim.placeOnStage({s:Math.min(t.s,r.length-5),lateral:t.lateral,speed:Math.max(0,t.speed)}),this.sim.vehicle.drivetrain.transmission.reset(Math.max(1,t.gear)),this.sim.vehicle.drivetrain.engine.omega=Math.max(this.sim.vehicle.drivetrain.engine.idleOmega,Math.max(0,t.speed)/.318*n.config.drivetrain.finalDrive.front*(n.config.drivetrain.transmission.gearRatios[Math.max(1,t.gear)-1]??1))),this._syncBridge(),this.report.warnings.length&&this.bus.emit?.(this.EV.NOTIFICATION,{title:`Tuning notes`,message:this.report.warnings.slice(0,3).join(` | `)}),this.report}reset(){this.rebuild({keepPose:!1}),this.bridge.stageDistanceM=0,this.bridge.stageTimeSec=0,this.bridge.lastPacenoteIndex=-1}shift(e){let t=this.sim.vehicle.drivetrain;e>0?t.shiftUp():t.shiftDown()}step(e){this._pendingRebuild&&this.rebuild({keepPose:!0});let t=this.bridge,n=this.sim,r=n.vehicle.drivetrain,i=r.transmission,a=t.inputs;if(a.isAutomatic&&!i.shifting){let e=r.engine.rpm;i.gear===0?r.selectGear(1):e>this.redlineRpm-this.opt.autoShiftUpMargin&&i.gear<i.gearCount&&a.throttle>.3?r.shiftUp():e<this.opt.autoShiftDownRpm&&i.gear>1&&n.vehicle.chassis.speed>3&&r.shiftDown()}n.setInputs({throttle:a.throttle,brake:a.brake,steer:a.steer,handbrake:a.handbrake,clutch:a.clutch>.02?a.clutch:null,launchSwitch:n.vehicle.chassis.speed<2&&a.clutch>.5&&a.throttle>.8}),n.update(e),this._syncBridge(),this._emitEvents()}broadcast(e){let t=this.sim;this.peakBoostBar=Math.max(this.peakBoostBar,t.vehicle.drivetrain.engine.turbo.boostGaugePa/1e5);let n=cf(t,{timestamp:e,inputs:this.bridge.inputs,uiTravelMm:this.opt.uiTravelMm,peakBoostBar:this.peakBoostBar,uiNotes:this.uiNotes,stateHash:t.stateHash({surface:!1})});return this.lastTelemetry=n,this.bus.emit(this.EV.TELEMETRY_UPDATE,n),this.bus.emit?.(this.EV.PHYSICS_TICK,{tick:t.tick,time:t.time}),n}_syncBridge(){let e=this.bridge,t=this.sim,n=t.vehicle.chassis,r=t.vehicle.drivetrain,i=n.attitude;e.position=Kd(n.position),e.velocity={x:n.velocity.x,y:n.velocity.y,z:-n.velocity.z},e.rotation={yaw:i.heading*180/Math.PI,pitch:i.pitch*180/Math.PI,roll:i.roll*180/Math.PI},e.angularVelocity={yaw:-n.angularVelocity.y*180/Math.PI,pitch:0,roll:0},e.speedMs=n.speed,e.speedKph=n.speed*3.6,e.engineRpm=r.engine.rpm,e.gear=r.transmission.gear,e.turboBoostBar=r.engine.turbo.boostGaugePa/1e5,e.peakBoostBar=this.peakBoostBar,e.steeringAngleDeg=-n.steerAngle*180/Math.PI,e.stageDistanceM=t.runtime?t.runtime.s:t.odometer,e.stageTimeSec=t.runtime?t.runtime.elapsed:t.time,e.isAirborne=n.wheels.every(e=>!e.contact),e.wheels&&af.forEach((t,r)=>{let i=n.wheels[r],a=e.wheels[t];if(!a)return;let o=X(i.z/i.susp.travel,0,1);a.suspensionTravelMm=X(this.opt.uiTravelMm/2-(i.z-i.z0)*1e3*(this.opt.uiTravelMm/(i.susp.travel*1e3)),0,this.opt.uiTravelMm),a.compressionPct=o*100,a.bottomedOut=i.z>i.susp.travel-.004,a.slipAngleDeg=i.slipAngle*180/Math.PI,a.slipRatio=i.slipRatio,a.rotationRad=i.angle,a.steerAngleDeg=-i.steer*180/Math.PI,a.onGround=i.contact,a.coreTempC=i.tire.coreK-273.15,a.surfaceTempC=i.tire.surfaceK-273.15,a.pressurePsi=i.tire.pressurePa/1e3*Ud,a.gripUtilPct=Math.round(X(i.tire.out.saturation*100,0,100)),a.angularVelocityRps=i.omega/(2*Math.PI)})}_emitEvents(){let e=this.sim,t=this.EV,n=this.bus,r=e.vehicle.chassis,i=e.vehicle.drivetrain.engine,a=e=>e;for(let r of e.drainEvents())switch(r.type){case`shift`:r.to>0&&(n.emit(t.GEAR_SHIFT,{gear:a(r.to),direction:r.to>r.from?`up`:`down`}),r.to>r.from&&i.turbo.boostGaugePa>8e4&&(n.emit(t.TURBO_BLOWOFF),n.emit(t.BACKFIRE_POP)));break;case`pacenote`:{let e=this.uiNotes.get(r.id);e&&n.emit(t.PACENOTE_TRIGGER,e);break}case`body_impact`:n.emit(t.VEHICLE_COLLISION,{zone:r.zone,energyJ:r.energy,severity:X(r.energy/2e4,0,1)});break;case`radiator_puncture`:n.emit(t.NOTIFICATION,{title:`Damage`,message:`Radiator punctured - coolant leaking`});break;case`tie_rod_bent`:n.emit(t.NOTIFICATION,{title:`Damage`,message:`Bent tie-rod (${[`FL`,`FR`,`RL`,`RR`][r.wheel]})`});break;case`engine_seized`:n.emit(t.NOTIFICATION,{title:`Engine`,message:`Engine seized`});break;case`engine_stall`:n.emit(t.NOTIFICATION,{title:`Engine`,message:`Engine stalled`});break;case`gear_grind`:n.emit(t.NOTIFICATION,{title:`Gearbox`,message:`Gear grind`});break;case`off_course`:n.emit(t.NOTIFICATION,{title:`Stage`,message:`Off course`});break;case`checkpoint`:n.emit(t.NOTIFICATION,{title:r.name,message:`${r.time.toFixed(1)} s`});break;case`stage_finish`:n.emit(t.NOTIFICATION,{title:`Stage complete`,message:`${r.time.toFixed(1)} s`})}let o=i.turbo.bovOpen>.5&&i.turbo.boostGaugePa>4e4;o&&!this.prev.bov&&n.emit(t.TURBO_BLOWOFF),this.prev.bov=o;let s=i.out.alsActive?7:i.out.fuelCut&&i.rpm>3e3?14:0;s>0&&this.rng.next()<1/60*s&&n.emit(t.BACKFIRE_POP),r.wheels.forEach((e,r)=>{let i=e.z>e.susp.travel-.004;i&&!this.prev.bottomed[r]&&n.emit(t.BOTTOM_OUT,{wheelId:af[r],energyJ:e.impactEnergy}),this.prev.bottomed[r]=i})}dispose(){for(let e of this._offs)e?.();this._offs.length=0}};function uf(e,{eventBus:t,RALLY_EVENTS:n,stateStore:r,config:i,options:a}){let o=new lf({bridge:e,eventBus:t,RALLY_EVENTS:n,stateStore:r,config:i,options:a});return e._stepPhysics=t=>{e.tickCount=(e.tickCount??0)+1,o.step(t)},e._broadcastTelemetry=e=>{o.broadcast(e)},e.resetVehicle=()=>o.reset(),e.shiftGear=e=>o.shift(e),e.setStageSpline=t=>{e.stageSpline=t},e.engineLink=o,o}var df={engine:{$comment:`Rally2-class 1.6 L turbo four. SI units except where a key says otherwise (rpm, kPa, deg).`,engine:{name:`1.6L I4 turbo (restricted)`,displacement:.00162,inertia:.22,idleRpm:1100,stallRpm:450,startRunning:!0,torqueCurve:[[1e3,80],[1500,110],[2e3,190],[2500,300],[3e3,360],[3500,390],[4e3,405],[4500,400],[5e3,392],[5500,375],[6e3,350],[6500,320],[7e3,290]],dynoBoostKPa:[[1e3,0],[1500,15],[2e3,50],[2500,95],[3e3,122],[3500,142],[4e3,150],[5e3,150],[6e3,145],[7e3,140]],dynoIntakeTempK:318,dynoAmbientPressure:101325,volumetricEfficiency:[[1e3,.8],[2500,.9],[4e3,.95],[5500,.93],[7e3,.86]],friction:{f0:9,f1:.01,f2:28e-6,pumpingGain:1.1},throttle:{responseTime:.04,idleFlowFraction:.18,flowExponent:2.5},torqueResponseTime:.03,ignition:{retardEfficiency:[[0,1],[10,.97],[20,.88],[30,.7],[40,.45],[50,.2],[60,0]],retardExhaustHeatK:220},exhaust:{afr:12.8,tempLowK:900,tempHighK:1250},starter:{torque:90,cutoffRpm:600}},ecu:{throttleMap:{x:[0,1e3,2e3,3e3,4500,6e3,7500],y:[0,.1,.25,.5,.75,1],z:[[0,0,0,0,0,0,0],[.08,.09,.1,.1,.1,.1,.1],[.2,.23,.25,.26,.26,.26,.26],[.45,.48,.5,.52,.52,.52,.52],[.72,.76,.79,.8,.8,.8,.8],[1,1,1,1,1,1,1]]},boostTargetMap:{x:[1e3,2e3,3e3,4e3,5e3,6e3,7e3],y:[0,.3,.6,1],z:[[0,0,0,0,0,0,0],[0,15,30,45,45,45,45],[0,40,80,100,100,100,100],[0,60,125,150,150,145,140]]},idle:{kp:6e-4,ki:.0015,baseThrottle:.03,maxThrottle:.25},revLimiter:{rpm:6900,hysteresis:150},launch:{enabled:!0,rpm:4500,maxSpeed:2,maxRetardDeg:35},als:{enabled:!0,minRpm:3e3,pedalThreshold:.08,throttle:.1,retardDeg:45,extraExhaustK:100,fuelMultiplier:1.5,exhaustFlowBoost:1.3,boostTargetKPa:120,maxExhaustTempK:1400,maxDuration:10,cooldown:2},boostControl:{kp:.001,ki:.002,integralLimit:50,feedForward:.9,overboostKPa:220},overheatDerate:{startK:388,endK:403,minPower:.55},blip:{throttle:.35}},turbo:{shaftInertia:16e-6,idleShaftSpeed:3e3,maxShaftSpeed:21e3,frictionCoefficient:4e-6,coulombFriction:.002,plenumVolume:.0065,compressor:{tipRadius:.0275,efficiency:.72,workCoefficient:.58,chokeFlow:.3,referenceSpeed:2e4,surgeBackflow:.5},turbine:{efficiency:.62,flowCoefficient:2e-5},wastegate:{springPressure:6e4,maxControlPressure:26e4,pressureRange:7e4,responseTime:.06,flowFraction:.85},blowOff:{flowCoefficient:2e-4,responseTime:.03}},intercooler:{effectiveness:.78,airflowBase:.55,airflowSpeed:25,blockageEffect:.85,thermalTimeConstant:.6,pressureDropBase:.04,blockagePressureDrop:3,bovThrottleThreshold:.12,bovMinBoost:15e3}},drivetrain:{$comment:`Layout is AWD | RWD | FWD. Ratios are dimensionless, torques N m, inertias kg m^2.`,layout:`AWD`,autoClutch:{enabled:!0,engageStartRpm:1800,engageEndRpm:3200,speedStart:1,speedFull:4},clutch:{maxTorque:900,kineticRatio:.92,biteStart:.15,biteEnd:.8,pedalResponseTime:.04,thermal:{heatCapacity:2500,coolingCoeff:12,coolingPerRadS:.02,fadeStartK:520,fadeEndK:720,fadeMin:.55},wear:{perJoule:15e-9,maxCapacityLoss:.45,biteShift:.12}},transmission:{type:`sequential`,gearRatios:[2.78,1.95,1.45,1.13,.92],reverseRatio:2.9,inertia:.04,efficiency:{geared:.96,directDrive:.98},minShiftInterval:.05,reverseLockoutSpeed:1.5,sequential:{shiftTime:.045,ignitionCutTime:.08,autoBlip:!0},hPattern:{shiftTime:.25,clutchRequired:.85,grindWear:.02,syncWearPerRadS:2e-5,syncTimePerRadS:4e-4},popOut:{wearThreshold:.8,holdTorque:600}},finalDrive:{front:4.9,rear:4.9},efficiency:{finalDrive:.97},centerDiff:{type:`lsd`,baseSplit:.4,preload:100,powerRampDeg:45,coastRampDeg:70,maxLockTorque:600,pack:{rampGain:.2}},frontDiff:{type:`lsd`,preload:60,powerRampDeg:45,coastRampDeg:60,pack:{mu:.12,surfaces:8,meanRadius:.05,rampRadius:.0686}},rearDiff:{type:`lsd`,preload:80,powerRampDeg:45,coastRampDeg:60,pack:{mu:.12,surfaces:8,meanRadius:.05,rampRadius:.0686}}},chassis:{$comment:`Body frame: +X forward, +Y up, +Z right, origin at the sprung centre of gravity. Spring/damper values are at the spring/damper; wheel rates = value * motionRatio^2.`,mass:1290,frontWeightFraction:.54,wheelbase:2.53,trackFront:1.55,trackRear:1.55,cgHeight:.46,inertia:{roll:430,yaw:1900,pitch:1950},unsprungMass:{front:30,rear:32},tires:{front:`rally_gravel_15`,rear:`rally_gravel_15`,pressureKPa:{front:160,rear:160}},steering:{maxWheelAngleDeg:32,ackermann:.6,rate:2.5,speedReduction:.5,speedReductionRef:45},suspension:{front:{springRate:52e3,motionRatio:.85,preload:0,travel:.22,helper:{rate:15e3,bindTravel:.025},damper:{bumpSlow:4150,bumpFast:1660,reboundSlow:6920,reboundFast:2770,kneeVelocityBump:.08,kneeVelocityRebound:.1},bumpStop:{length:.05,rate:6e4,progressive:3e6,damping:6e3},antiRollBar:{stiffness:900,armLength:.25},staticCamberDeg:-1.8,camberGainDegPerM:-10,staticToeDeg:.05,toeBumpSteerDegPerM:0,endStopDamping:15e3},rear:{springRate:46e3,motionRatio:.85,preload:0,travel:.23,helper:{rate:15e3,bindTravel:.025},damper:{bumpSlow:3800,bumpFast:1500,reboundSlow:6500,reboundFast:2600,kneeVelocityBump:.08,kneeVelocityRebound:.1},bumpStop:{length:.05,rate:6e4,progressive:3e6,damping:6e3},antiRollBar:{stiffness:500,armLength:.25},staticCamberDeg:-1.2,camberGainDegPerM:-8,staticToeDeg:.2,toeBumpSteerDegPerM:0,endStopDamping:15e3}},aero:{dragArea:.8,sideArea:3,liftArea:.35,downforceBalance:.45,dragHeight:.1},underbody:{frontX:.7,rearX:-.7,groundClearance:.17,stiffness:15e4,damping:4e3,friction:.5},brakes:{maxTorqueFront:3800,maxTorqueRear:2400,handbrakeTorqueRear:3e3,frontBias:.62},hull:{stiffness:4e5,damping:9e3,friction:.6,points:[{name:`bumperFrontLeft`,zone:`front`,x:2,y:-.05,z:-.8},{name:`bumperFrontRight`,zone:`front`,x:2,y:-.05,z:.8},{name:`bumperRearLeft`,zone:`rear`,x:-2,y:-.05,z:-.8},{name:`bumperRearRight`,zone:`rear`,x:-2,y:-.05,z:.8},{name:`roofFrontLeft`,zone:`roof`,x:.6,y:.99,z:-.7},{name:`roofFrontRight`,zone:`roof`,x:.6,y:.99,z:.7},{name:`roofRearLeft`,zone:`roof`,x:-.9,y:.99,z:-.7},{name:`roofRearRight`,zone:`roof`,x:-.9,y:.99,z:.7}]},limits:{maxAngularRate:40,maxSpeed:130,maxTireLoad:9e4}},tires:{$comment:`Tyre compounds. Temperatures in K, pressures in kPa (gauge), stiffness values are per unit load: Fx/Fz per unit slip ratio and Fy/Fz per unit tan(alpha) at nominal load.`,compounds:{rally_gravel_15:{model:`pacejka`,radius:.318,width:.205,mass:9.5,wheelInertia:1.35,nominalLoad:4e3,nominalPressureKPa:160,optimalPressureKPa:165,verticalStiffness:23e4,verticalDamping:1100,bottomOutDeflection:.045,relaxationLength:.35,minSpeed:1.5,slipClamp:4,mu0:1.25,muRatioY:.97,loadSensitivity:.12,stiffness:{longitudinal:20,lateral:13,peakLoadRatio:1.4},pacejka:{Ex:-.3,Ey:-.8,shapeMin:1.05},brush:{stribeckSpeed:1.5},camberStiffnessRatio:.06,pneumaticTrail:.035,rollingResistance:1,rollingSpeedCoeff:2e-6,temperature:{optimalK:345,coldWidth:38,hotWidth:55,minGrip:.72,stiffnessSens:.12},pressure:{gripQuad:1.6,stiffnessSens:.8},surfaceGrip:{tarmac:.82,wet_tarmac:.85,dirt:1.05,gravel:1.08,mud:1,snow:.9,ice:.7},thermal:{surfaceHeatCapacity:1500,coreHeatCapacity:8e3,surfaceCoreConductance:250,surfaceArea:.45,coreArea:.6,coreConvectionRatio:.6,convection0:20,convection1:3,roadConductance:30,slipHeatFraction:.55,surfacePartition:.6,hysteresisFraction:.7},wear:{energyToWorn:6e7,gripLoss:.35,overheatMarginK:25}},rally_tarmac_18:{model:`pacejka`,radius:.327,width:.235,mass:10.5,wheelInertia:1.5,nominalLoad:4e3,nominalPressureKPa:190,optimalPressureKPa:195,verticalStiffness:27e4,verticalDamping:1200,bottomOutDeflection:.04,relaxationLength:.3,minSpeed:1.5,slipClamp:4,mu0:1.55,muRatioY:1,loadSensitivity:.15,stiffness:{longitudinal:24,lateral:16,peakLoadRatio:1.4},pacejka:{Ex:-.4,Ey:-1,shapeMin:1.05},brush:{stribeckSpeed:1.5},camberStiffnessRatio:.07,pneumaticTrail:.04,rollingResistance:.9,rollingSpeedCoeff:2e-6,temperature:{optimalK:345,coldWidth:35,hotWidth:50,minGrip:.68,stiffnessSens:.12},pressure:{gripQuad:1.8,stiffnessSens:.8},surfaceGrip:{tarmac:1,wet_tarmac:.9,dirt:.7,gravel:.6,mud:.55,snow:.5,ice:.55},thermal:{surfaceHeatCapacity:1500,coreHeatCapacity:8e3,surfaceCoreConductance:250,surfaceArea:.45,coreArea:.6,coreConvectionRatio:.6,convection0:20,convection1:3,roadConductance:30,slipHeatFraction:.55,surfacePartition:.6,hysteresisFraction:.7},wear:{energyToWorn:4e7,gripLoss:.4,overheatMarginK:20}},rally_snow_studded_15:{model:`brush`,radius:.318,width:.195,mass:9.8,wheelInertia:1.4,nominalLoad:4e3,nominalPressureKPa:140,optimalPressureKPa:130,verticalStiffness:215e3,verticalDamping:1050,bottomOutDeflection:.05,relaxationLength:.38,minSpeed:1.5,slipClamp:4,mu0:1.15,muRatioY:.95,loadSensitivity:.1,stiffness:{longitudinal:18,lateral:12,peakLoadRatio:1.4},pacejka:{Ex:-.3,Ey:-.8,shapeMin:1.05},brush:{stribeckSpeed:2},camberStiffnessRatio:.05,pneumaticTrail:.03,rollingResistance:1.1,rollingSpeedCoeff:2e-6,temperature:{optimalK:303,coldWidth:45,hotWidth:40,minGrip:.85,stiffnessSens:.08},pressure:{gripQuad:1,stiffnessSens:.8},surfaceGrip:{tarmac:.55,wet_tarmac:.6,dirt:.9,gravel:.9,mud:.9,snow:1.35,ice:2.4},thermal:{surfaceHeatCapacity:1500,coreHeatCapacity:8e3,surfaceCoreConductance:250,surfaceArea:.45,coreArea:.6,coreConvectionRatio:.6,convection0:20,convection1:3,roadConductance:30,slipHeatFraction:.55,surfacePartition:.6,hysteresisFraction:.7},wear:{energyToWorn:5e7,gripLoss:.3,overheatMarginK:25}}}},surfaces:{$comment:`friction = peak friction multiplier relative to the tyre's mu0 (before per-compound surfaceGrip). slideRatio = sliding/peak force. stiffness scales cornering & longitudinal stiffness. penetrationDepth [m] = depth at which a loose layer hides 63% of what lies beneath. depthResistance = extra rolling-resistance coefficient per metre of loose depth. evolution: how the surface changes under traffic (see systems/surface_evolution): sweepPerMeter = fraction of loose depth displaced per metre of wheel travel at nominal load; bearingPressure/soilStiffness drive rut depth; reposeSlope = max depth difference per metre between neighbouring cells before material flows; compactionPerMeter = packing rate.`,categories:[`tarmac`,`wet_tarmac`,`dirt`,`gravel`,`mud`,`snow`,`ice`],surfaces:{tarmac:{category:`tarmac`,friction:1,slideRatio:.88,stiffness:1,rollingResistance:.012,roadTempOffsetK:8,heatTransfer:1,abrasiveness:1,pressureSensitivity:0,roughness:8e-4},tarmac_wet:{category:`wet_tarmac`,friction:.72,slideRatio:.85,stiffness:.95,rollingResistance:.014,roadTempOffsetK:-3,heatTransfer:1.5,abrasiveness:.8,pressureSensitivity:0,roughness:8e-4},packed_dirt:{category:`dirt`,friction:.7,slideRatio:.92,stiffness:.8,rollingResistance:.022,roadTempOffsetK:4,heatTransfer:.7,abrasiveness:1.1,pressureSensitivity:.05,roughness:.004,evolution:{loose:!1,compactionPerMeter:.002,bearingPressure:5e5,soilStiffness:8e6,maxRut:.03}},gravel:{category:`gravel`,friction:.55,slideRatio:.95,stiffness:.55,rollingResistance:.03,depthResistance:.6,penetrationDepth:.04,roadTempOffsetK:3,heatTransfer:.6,abrasiveness:1.6,pressureSensitivity:.12,roughness:.006,evolution:{loose:!0,sweepPerMeter:.12,compactionPerMeter:.01,bearingPressure:25e4,soilStiffness:4e6,maxRut:.05,reposeSlope:.6,ridgeFraction:.3}},mud:{category:`mud`,friction:.36,slideRatio:.9,stiffness:.5,rollingResistance:.07,depthResistance:1.4,penetrationDepth:.07,roadTempOffsetK:0,heatTransfer:.9,abrasiveness:.5,pressureSensitivity:.2,roughness:.008,evolution:{loose:!0,sweepPerMeter:.02,compactionPerMeter:.004,bearingPressure:4e4,soilStiffness:6e5,maxRut:.2,reposeSlope:.15,ridgeFraction:.5}},snow:{category:`snow`,friction:.28,slideRatio:.92,stiffness:.45,rollingResistance:.05,depthResistance:1,penetrationDepth:.08,roadTempOffsetK:-6,roadTempCapK:273.15,heatTransfer:1.4,abrasiveness:.2,pressureSensitivity:.3,roughness:.004,evolution:{loose:!0,sweepPerMeter:.015,compactionPerMeter:.03,bearingPressure:6e4,soilStiffness:8e5,maxRut:.12,reposeSlope:.4,ridgeFraction:.3,compactTo:`snow_packed`,compactThreshold:.5}},snow_packed:{category:`snow`,friction:.34,slideRatio:.88,stiffness:.6,rollingResistance:.02,roadTempOffsetK:-6,roadTempCapK:272.15,heatTransfer:1.3,abrasiveness:.3,pressureSensitivity:.2,roughness:.002,evolution:{loose:!1,compactionPerMeter:.002,bearingPressure:4e5,soilStiffness:6e6,maxRut:.02}},ice:{category:`ice`,friction:.1,slideRatio:.85,stiffness:.4,rollingResistance:.01,penetrationDepth:.004,roadTempOffsetK:-8,roadTempCapK:272.15,heatTransfer:1.5,abrasiveness:.3,pressureSensitivity:.05,roughness:5e-4},grass:{category:`dirt`,friction:.42,slideRatio:.95,stiffness:.5,rollingResistance:.055,depthResistance:0,roadTempOffsetK:0,heatTransfer:.8,abrasiveness:.6,pressureSensitivity:.18,roughness:.01,evolution:{loose:!1,compactionPerMeter:.003,bearingPressure:12e4,soilStiffness:15e5,maxRut:.08}}}},damage:{$comment:`Component wear and damage model parameters. Temperatures in K, energies in J.`,seed:20241015,brakes:{pedalResponseTime:.03,discMass:{front:8.5,rear:6},discSpecificHeat:480,coolingBase:10,coolingSpeed:2.4,radiativeArea:.04,padFrictionByTemp:[[250,.7],[293,.8],[400,.94],[520,1],[820,1],[920,.8],[1020,.5],[1150,.3]],fluidBoilK:480,fluidFade:.6,fluidCoupling:.5,fluidTimeConstant:25,padWearPerJoule:9e-9},cooling:{coolantMass:7.5,coolantSpecificHeat:3400,engineThermalMass:32e3,heatFractionToCoolant:.3,radiatorUA:1400,radiatorUAAirExponent:.6,radiatorAirReferenceSpeed:25,fanSpeedEquivalent:6,heatLossToAmbient:40,systemPressure:12e4,thermostatOpenK:363,thermostatFullK:373,leakCoefficient:3e-6,airLockLevel:.45,initialTempOffsetK:65,overheatK:393,seizeK:413,seizeTime:8,radiatorBlockageEffect:.8},intercooler:{mudBlockPerMeterSplash:.012,snowBlockPerMeter:.006,gravelDustBlockPerMeter:.004,airflowClearRate:.05,speedForClearing:40},impact:{stoneStrikePerSecondAt30ms:.01,looseDepthForStones:.02,radiatorHitEnergyJ:120,radiatorPunctureEnergyJ:400,tieRodBendEnergyJ:1500,tieRodBendRadPerJoule:12e-6,tieRodMaxToeRad:.09,shockToEnergy:.35,underbodyRadiatorEnergyFactor:.3,tireLeakEnergyJ:150,tireLeakRate:.004,episodeGap:.2},turbo:{overspeedDamagePerSecond:.02,exhaustDamageK:1420,exhaustDamagePerSecond:.004,boostLeakAtFullDamage:.6},damperWearPerMeter:25e-7},simulation:{$comment:`dt is the fixed physics step [s]. ambient is the sea-level reference atmosphere; with altitudeCorrection the engine and aero use the ISA values at the stage elevation.`,dt:.002,maxStepsPerUpdate:100,ambient:{temperature:288.15,pressure:101325,altitudeCorrection:!0},wind:{x:0,y:0,z:0},telemetryHz:60,seed:1,evolution:{enabled:!0,rowSpacing:1,columnSpacing:.25},flatTerrain:{height:0,layers:[{type:`tarmac`}]}},gpsStageSchema:{$schema:`http://json-schema.org/draft-07/schema#`,$id:`gps_stage_schema.json`,title:`GPS rally stage`,description:`A rally special stage described by parallel WGS84 arrays. Lengths of lat, lng, elevation (and width / bank if present) must match. The parser converts them to a local 3D Cartesian spline (x = East, y = Up, z = -North).`,type:`object`,required:[`schemaVersion`,`id`,`name`,`track`],additionalProperties:!1,properties:{$schema:{type:`string`},schemaVersion:{const:`1.0`},id:{type:`string`,minLength:1},name:{type:`string`,minLength:1},country:{type:`string`},datum:{enum:[`WGS84`]},seed:{type:`integer`,description:`Seeds procedural banking noise and stone strikes for this stage.`},origin:{$ref:`#/definitions/geoPoint`},track:{type:`object`,required:[`lat`,`lng`,`elevation`],additionalProperties:!1,properties:{lat:{type:`array`,minItems:4,items:{type:`number`,minimum:-90,maximum:90}},lng:{type:`array`,minItems:4,items:{type:`number`,minimum:-180,maximum:180}},elevation:{type:`array`,minItems:4,items:{type:`number`,minimum:-500,maximum:9e3}},width:{type:`array`,minItems:4,items:{type:`number`,exclusiveMinimum:2,maximum:30}},bank:{type:`array`,minItems:4,items:{type:`number`,minimum:-25,maximum:25},description:`Optional measured road banking per point in degrees (positive = right side lower). Overrides procedural banking where given.`},closed:{type:`boolean`}}},road:{type:`object`,additionalProperties:!1,properties:{defaultWidth:{type:`number`,exclusiveMinimum:2,maximum:30},crownSlope:{type:`number`,minimum:0,maximum:.12,description:`Cross-fall from crown to edge as m/m.`},shoulderWidth:{type:`number`,minimum:0,maximum:20},shoulderLayers:{$ref:`#/definitions/layers`},verge:{type:`object`,additionalProperties:!1,properties:{slope:{type:`number`,minimum:-1,maximum:1},width:{type:`number`,minimum:0,maximum:40},layers:{$ref:`#/definitions/layers`}}},defaultLayers:{$ref:`#/definitions/layers`}}},processing:{type:`object`,additionalProperties:!1,properties:{sampleSpacing:{type:`number`,minimum:.25,maximum:5},horizontalSmoothing:{type:`number`,minimum:0,maximum:30,description:`Gaussian sigma [m] applied to the horizontal path (GPS noise).`},elevationSmoothing:{type:`number`,minimum:0,maximum:100,description:`Gaussian sigma [m] applied to elevation.`},curvatureSmoothing:{type:`number`,minimum:0,maximum:50},designSpeed:{type:`number`,minimum:5,maximum:80,description:`Speed [m/s] used to size procedural banking.`},bankFraction:{type:`number`,minimum:0,maximum:1},maxBankDeg:{type:`number`,minimum:0,maximum:20},bankNoiseDeg:{type:`number`,minimum:0,maximum:10},bankNoiseWavelength:{type:`number`,minimum:10,maximum:500},verticalCurvatureSmoothing:{type:`number`,minimum:0,maximum:60,description:`Gaussian sigma [m] applied to elevation before computing vertical curvature (crest / dip detection).`},apexCurvatureSmoothing:{type:`number`,minimum:0,maximum:40,description:`Gaussian sigma [m] of the robust curvature used for corner radius / severity (rejects GPS jitter).`}}},surfaces:{type:`array`,items:{type:`object`,required:[`fromDistance`,`toDistance`,`layers`],additionalProperties:!1,properties:{fromDistance:{type:`number`,minimum:0},toDistance:{type:`number`,minimum:0},layers:{$ref:`#/definitions/layers`}}}},pacenotes:{type:`object`,additionalProperties:!1,properties:{mode:{enum:[`auto`,`explicit`,`merge`]},severityScale:{enum:[`six_easiest`,`one_easiest`]},leadTimeSeconds:{type:`number`,minimum:1,maximum:15},minLeadDistance:{type:`number`,minimum:10,maximum:400},speechRate:{type:`number`,minimum:1,maximum:8,description:`Words per second used to estimate how long a call takes.`},notes:{type:`array`,items:{type:`object`,required:[`distance`,`type`],additionalProperties:!1,properties:{distance:{type:`number`,minimum:0},type:{enum:[`left`,`right`,`straight`,`crest`,`jump`,`dip`,`bump`,`caution`,`finish`,`custom`]},severity:{type:[`integer`,`string`]},modifiers:{type:`array`,items:{type:`string`}},text:{type:`string`},priority:{type:`integer`,minimum:0,maximum:3}}}}}},checkpoints:{type:`array`,items:{type:`object`,required:[`distance`,`name`],additionalProperties:!1,properties:{distance:{type:`number`,minimum:0},name:{type:`string`}}}}},definitions:{geoPoint:{type:`object`,required:[`lat`,`lng`],additionalProperties:!1,properties:{lat:{type:`number`,minimum:-90,maximum:90},lng:{type:`number`,minimum:-180,maximum:180},elevation:{type:`number`}}},layers:{type:`array`,minItems:1,items:{type:`object`,required:[`type`],additionalProperties:!1,properties:{type:{type:`string`,minLength:1},depth:{type:`number`,minimum:0,maximum:1}}}}}}},ff=class{constructor(){this.viewportContainer=document.getElementById(`viewportContainer`),this.stagePickerMount=document.getElementById(`stagePickerMount`),this.garageStudioMount=document.getElementById(`garageStudioMount`),this.telemetryHudMount=document.getElementById(`telemetryHudMount`),this.sceneManager=null,this.stagePicker=null,this.tuningStudio=null,this.telemetryHud=null,this.toastEl=document.getElementById(`rallyToast`),this.toastTitle=document.getElementById(`toastTitle`),this.toastMsg=document.getElementById(`toastMsg`),this.toastTimeout=null,this.init()}init(){this.sceneManager=new Pl(this.viewportContainer),this.stagePicker=new Ll(this.stagePickerMount),this.tuningStudio=new Bl(this.garageStudioMount),this.telemetryHud=new Wl(this.telemetryHudMount),i.physicsBridge=a;try{this.engineLink=uf(a,{eventBus:e,RALLY_EVENTS:t,stateStore:i,config:df}),console.log(`[RallyApplication] Deterministic Physics Engine Installed Successfully`)}catch(e){console.warn(`[RallyApplication] Physics engine install fallback to arcade dynamics:`,e)}a.start(),this._bindNavigation(),this._bindAudioUnlock(),this._bindGlobalHotkeys(),this._bindToastNotifications(),this.showToast(`SYSTEM READY`,`EA Rally Viewport & Physics Bridge Active`)}_bindNavigation(){let n=document.querySelectorAll(`.nav-tab-btn`);n.forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.tab;i.setActiveTab(t)})}),e.on(t.ACTIVE_TAB_CHANGED,({tabId:e})=>{n.forEach(t=>{t.dataset.tab===e?t.classList.add(`active`):t.classList.remove(`active`)}),e===`stage_drive`?(this.stagePickerMount.style.display=`none`,this.garageStudioMount.style.display=`none`,i.setCameraMode(`chase`)):e===`garage_studio`?(this.stagePickerMount.style.display=`none`,this.garageStudioMount.style.display=`flex`,i.setCameraMode(`helicopter`)):e===`stage_planner`&&(this.garageStudioMount.style.display=`none`,this.stagePickerMount.style.display=`flex`,this.stagePicker.drawMap(),this.stagePicker.elevationGraph&&this.stagePicker.elevationGraph.resize())});let r=document.querySelectorAll(`.cam-btn`);r.forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.cam;i.setCameraMode(t)})}),e.on(t.CAMERA_VIEW_CHANGED,({mode:e})=>{r.forEach(t=>{t.dataset.cam===e?t.classList.add(`active`):t.classList.remove(`active`)})})}_bindAudioUnlock(){let e=()=>{o.initAudioContext(),window.removeEventListener(`click`,e),window.removeEventListener(`keydown`,e)};window.addEventListener(`click`,e,{once:!0}),window.addEventListener(`keydown`,e,{once:!0});let t=document.getElementById(`btnAudioToggle`),n=document.getElementById(`audioIcon`),r=document.getElementById(`audioLabel`);t&&t.addEventListener(`click`,()=>{o.initAudioContext();let e=o.toggleMute();n.textContent=e?`🔇`:`🔊`,r.textContent=e?`AUDIO MUTED`:`AUDIO ACTIVE`})}_bindGlobalHotkeys(){window.addEventListener(`keydown`,e=>{if(![`INPUT`,`TEXTAREA`,`SELECT`].includes(e.target?.tagName)){if(e.code===`KeyG`){let e=i.activeTab===`garage_studio`?`stage_drive`:`garage_studio`;i.setActiveTab(e)}else if(e.code===`KeyP`){let e=i.activeTab===`stage_planner`?`stage_drive`:`stage_planner`;i.setActiveTab(e)}}})}_bindToastNotifications(){e.on(t.NOTIFICATION,({title:e,message:t})=>{this.showToast(e,t)})}showToast(e,t){this.toastEl&&(this.toastTitle.textContent=e||`ALERT`,this.toastMsg.textContent=t||``,this.toastEl.classList.add(`visible`),clearTimeout(this.toastTimeout),this.toastTimeout=setTimeout(()=>{this.toastEl.classList.remove(`visible`)},2800))}};window.addEventListener(`DOMContentLoaded`,()=>{new ff});