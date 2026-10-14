/* Gwat 3D — dependency-free WebGL: the signature as a gold tube that writes itself,
   plus gold "wind" dust. Usage: GwatGL(canvas,{fit:.55,particles:1400,delay:1.3}) */
(function(){
const m4={
  persp(f,a,n,fa){const t=1/Math.tan(f/2),nf=1/(n-fa);return[t/a,0,0,0,0,t,0,0,0,0,(fa+n)*nf,-1,0,0,2*fa*n*nf,0]},
  mul(a,b){const o=new Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s}return o},
  tr(x,y,z){return[1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]},
  rx(a){const c=Math.cos(a),s=Math.sin(a);return[1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]},
  ry(a){const c=Math.cos(a),s=Math.sin(a);return[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]},
  rz(a){const c=Math.cos(a),s=Math.sin(a);return[c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1]}
};
const V={sub:(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],add:(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],sc:(a,s)=>[a[0]*s,a[1]*s,a[2]*s],dot:(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],
  cr:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],n:a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l]}};

/* build the tube mesh from SIG.line (two strokes) */
function buildMesh(){
  const S=window.SIG,W=S.w,H=S.h,k=4/W;
  const strokes=S.line.map(d=>{const n=d.replace(/[ML]/g,' ').trim().split(/\s+/).map(Number);const p=[];for(let i=0;i<n.length;i+=2)p.push([(n[i]-W/2)*k,-(n[i+1]-H/2)*k]);return p});
  // resample evenly + smooth
  const rs=strokes.map(p=>{const L=[0];for(let i=1;i<p.length;i++)L.push(L[i-1]+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]));
    const tot=L[L.length-1],N=Math.max(20,Math.round(tot/.014)),o=[];let j=0;
    for(let i=0;i<=N;i++){const t=tot*i/N;while(j<L.length-2&&L[j+1]<t)j++;const f=(t-L[j])/((L[j+1]-L[j])||1);o.push([p[j][0]+(p[j+1][0]-p[j][0])*f,p[j][1]+(p[j+1][1]-p[j][1])*f])}
    for(let it=0;it<2;it++)for(let i=1;i<o.length-1;i++)o[i]=[(o[i-1][0]+o[i][0]*2+o[i+1][0])/4,(o[i-1][1]+o[i][1]*2+o[i+1][1])/4];
    return{p:o,len:tot}});
  const total=rs.reduce((a,b)=>a+b.len,0);
  const pos=[],nor=[],uu=[],idx=[];const RS=12,R=.04,nib=35*Math.PI/180;let uStart=0,base=0;
  rs.forEach((st,si)=>{const P=st.p,n=P.length;
    const pts=P.map((q,i)=>{const s=i/(n-1);return[q[0],q[1],.16*Math.sin(s*Math.PI*2*1.3+si*1.7)]});
    let N0=null;
    for(let i=0;i<n;i++){
      const a=pts[Math.max(0,i-1)],b=pts[Math.min(n-1,i+1)],T=V.n(V.sub(b,a));
      if(!N0){N0=V.n(V.cr(T,[0,0,1]));}else{N0=V.n(V.sub(N0,V.sc(T,V.dot(N0,T))))}
      const B=V.cr(T,N0),s=i/(n-1);
      const th=Math.atan2(T[1],T[0]);const taper=Math.pow(Math.min(1,Math.min(s,1-s)/.05),.7)*.85+.15;
      const r=R*(.32+.68*Math.abs(Math.sin(th+nib)))*taper;
      const u=uStart+(st.len/total)*s;
      for(let j=0;j<=RS;j++){const ang=j/RS*Math.PI*2,c=Math.cos(ang),sn=Math.sin(ang);
        const nn=[N0[0]*c+B[0]*sn,N0[1]*c+B[1]*sn,N0[2]*c+B[2]*sn];
        pos.push(pts[i][0]+nn[0]*r,pts[i][1]+nn[1]*r,pts[i][2]+nn[2]*r);nor.push(...nn);uu.push(u)}
      if(i<n-1)for(let j=0;j<RS;j++){const a0=base+i*(RS+1)+j,b0=a0+RS+1;idx.push(a0,b0,a0+1,b0,b0+1,a0+1)}
    }
    base+=n*(RS+1);uStart+=st.len/total});
  // the dot
  const D=window.SIG.dot,dp=[(D[0]-W/2)*k,-(D[1]-H/2)*k,0],dr=.032,dStart=pos.length/3,SR=10;
  for(let i=0;i<=SR;i++)for(let j=0;j<=SR;j++){const th=i/SR*Math.PI,ph=j/SR*Math.PI*2;const nn=[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)];pos.push(dp[0]+nn[0]*dr,dp[1]+nn[1]*dr,dp[2]+nn[2]*dr);nor.push(...nn);uu.push(.0)}
  for(let i=0;i<SR;i++)for(let j=0;j<SR;j++){const a0=dStart+i*(SR+1)+j,b0=a0+SR+1;idx.push(a0,b0,a0+1,b0,b0+1,a0+1)}
  return{pos:new Float32Array(pos),nor:new Float32Array(nor),u:new Float32Array(uu),idx:new Uint16Array(idx)};
}

const VS_T=`attribute vec3 p;attribute vec3 n;attribute float u;uniform mat4 uM,uV,uP;varying vec3 vN,vW;varying float vU;
void main(){vec4 w=uM*vec4(p,1.);vW=w.xyz;vN=mat3(uM)*n;vU=u;gl_Position=uP*uV*w;}`;
const FS_T=`precision highp float;uniform vec3 uCam;uniform float uGrow,uTime;varying vec3 vN,vW;varying float vU;
void main(){if(vU>uGrow)discard;vec3 N=normalize(vN),Vd=normalize(uCam-vW),R=reflect(-Vd,N);float h=R.y;
vec3 sky=mix(vec3(.22,.15,.08),vec3(1.,.86,.56),smoothstep(-.6,.65,h));sky+=vec3(1.,.6,.3)*exp(-abs(h-.02)*8.)*.5;
float sweep=sin(uTime*.6+vW.x*1.2);
vec3 gold=vec3(.92,.7,.36);float fr=pow(1.-max(dot(N,Vd),0.),2.5);
vec3 c=gold*sky*1.25;
c+=vec3(1.,.93,.75)*pow(max(dot(R,normalize(vec3(.45*sweep,.6,.8))),0.),28.)*1.8;
c+=vec3(1.,.8,.5)*pow(max(dot(R,normalize(vec3(-.8,.25,.45))),0.),10.)*.7;
c+=fr*vec3(1.,.9,.65)*.55;
float tip=smoothstep(.035,0.,uGrow-vU)*step(uGrow,.998);c+=vec3(1.,.86,.55)*tip*2.6;
c=c/(1.+c*.6);gl_FragColor=vec4(pow(c,vec3(.9)),1.);}`;
const VS_P=`attribute vec4 s;uniform float uTime,uPix,uW;uniform mat4 uV,uP;varying float vA;
void main(){float W=uW;float x=mod(s.x*W+uTime*(.18+s.z*.55),W)-W*.5;float y=(s.y-.5)*5.+sin(x*.65+s.w*6.28+uTime*.5)*.45;float z=(s.z-.5)*5.-.8;
vec4 mv=uV*vec4(x,y,z,1.);gl_Position=uP*mv;gl_PointSize=uPix*(.6+s.w*2.2)/(-mv.z);
vA=(.25+.75*s.w)*smoothstep(W*.5,W*.3,abs(x))*(.55+.45*sin(uTime*1.7+s.w*50.));}`;
const FS_P=`precision mediump float;varying float vA;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.0,d);a*=a;gl_FragColor=vec4(vec3(1.,.82,.5)*a*vA*1.4,a*vA);}`;

function prog(gl,vs,fs){const c=(t,s)=>{const sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(sh);return sh};
  const p=gl.createProgram();gl.attachShader(p,c(gl.VERTEX_SHADER,vs));gl.attachShader(p,c(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw gl.getProgramInfoLog(p);return p}
function buf(gl,data,target){const b=gl.createBuffer();gl.bindBuffer(target||gl.ARRAY_BUFFER,b);gl.bufferData(target||gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return b}

let MESH=null;
window.GwatGL=function(canvas,o){
  o=Object.assign({fit:.55,fitH:.6,particles:1400,delay:0,grow:2.6,offsetY:0,spin:false},o||{});
  let gl;try{gl=canvas.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:true})}catch(e){}
  if(!gl)return null;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,small=matchMedia('(max-width:640px)').matches;
  MESH=MESH||buildMesh();
  let pT,pP;try{pT=prog(gl,VS_T,FS_T);pP=prog(gl,VS_P,FS_P)}catch(e){console.warn(e);return null}
  const bP=buf(gl,MESH.pos),bN=buf(gl,MESH.nor),bU=buf(gl,MESH.u),bI=buf(gl,MESH.idx,gl.ELEMENT_ARRAY_BUFFER),nIdx=MESH.idx.length;
  const NP=small?Math.round(o.particles*.45):o.particles,seeds=new Float32Array(NP*4);for(let i=0;i<NP*4;i++)seeds[i]=Math.random();const bS=buf(gl,seeds);
  const L={p:gl.getAttribLocation(pT,'p'),n:gl.getAttribLocation(pT,'n'),u:gl.getAttribLocation(pT,'u'),s:gl.getAttribLocation(pP,'s')};
  const U=(p,n)=>gl.getUniformLocation(p,n);
  const uT={M:U(pT,'uM'),V:U(pT,'uV'),P:U(pT,'uP'),cam:U(pT,'uCam'),grow:U(pT,'uGrow'),time:U(pT,'uTime')},uPp={V:U(pP,'uV'),P:U(pP,'uP'),time:U(pP,'uTime'),pix:U(pP,'uPix'),W:U(pP,'uW')};
  let w=1,h=1,dpr=1,fov=35*Math.PI/180,camZ=8;
  function size(){dpr=Math.min(devicePixelRatio||1,small?1.5:1.75);w=canvas.clientWidth||1;h=canvas.clientHeight||1;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);gl.viewport(0,0,canvas.width,canvas.height);
    const a=w/h,t=2*Math.tan(fov/2);camZ=Math.max(4/(o.fit*t*a),2.3/(o.fitH*t))}
  size();new ResizeObserver(size).observe(canvas);
  let mx=0,my=0,tx=0,ty=0,scroll=0,vis=true,start=performance.now();
  if(!reduce&&matchMedia('(hover:hover)').matches)addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5});
  else if(!reduce)addEventListener('deviceorientation',e=>{if(e.gamma!=null){tx=Math.max(-.5,Math.min(.5,e.gamma/60));ty=Math.max(-.5,Math.min(.5,(e.beta-45)/80))}});
  let raf=0;const kick=()=>{if(!raf)raf=requestAnimationFrame(frame)};
  if('IntersectionObserver' in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)kick()}).observe(canvas);
  gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
  function frame(now){raf=0;
    if(!vis||document.hidden){return}
    const t=(now-start)/1000;mx+=(tx-mx)*.05;my+=(ty-my)*.05;
    let g=reduce?1:Math.min(1,Math.max(0,(t-o.delay)/o.grow));g=g<1?1-Math.pow(1-g,2.2):1;
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const P=m4.persp(fov,w/h,.1,60),Vw=m4.tr(0,0,-(camZ*(1+scroll*.6)));
    const sway=reduce?0:Math.sin(t*.45)*.18,bob=reduce?0:Math.sin(t*.8)*.05;
    let M=m4.mul(m4.tr(0,o.offsetY+bob+scroll*.8,0),m4.mul(m4.ry(sway+mx*.9+(o.spin?t*.35:0)+scroll*1.4),m4.mul(m4.rx(my*.5+scroll*.5),m4.rz(-mx*.08))));
    // tube
    gl.useProgram(pT);gl.disable(gl.BLEND);gl.depthMask(true);
    gl.bindBuffer(gl.ARRAY_BUFFER,bP);gl.enableVertexAttribArray(L.p);gl.vertexAttribPointer(L.p,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,bN);gl.enableVertexAttribArray(L.n);gl.vertexAttribPointer(L.n,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,bU);gl.enableVertexAttribArray(L.u);gl.vertexAttribPointer(L.u,1,gl.FLOAT,false,0,0);
    gl.uniformMatrix4fv(uT.M,false,M);gl.uniformMatrix4fv(uT.V,false,Vw);gl.uniformMatrix4fv(uT.P,false,P);
    gl.uniform3f(uT.cam,0,0,camZ*(1+scroll*.6));gl.uniform1f(uT.grow,g*1.002);gl.uniform1f(uT.time,t);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,bI);gl.drawElements(gl.TRIANGLES,nIdx,gl.UNSIGNED_SHORT,0);
    gl.disableVertexAttribArray(L.n);gl.disableVertexAttribArray(L.u);
    // particles
    if(NP){gl.useProgram(pP);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);gl.depthMask(false);
      gl.bindBuffer(gl.ARRAY_BUFFER,bS);gl.enableVertexAttribArray(L.s);gl.vertexAttribPointer(L.s,4,gl.FLOAT,false,0,0);
      gl.uniformMatrix4fv(uPp.V,false,m4.mul(Vw,m4.ry(mx*.3)));gl.uniformMatrix4fv(uPp.P,false,P);gl.uniform1f(uPp.time,reduce?0:t);gl.uniform1f(uPp.pix,h*dpr*.028);gl.uniform1f(uPp.W,12);
      gl.drawArrays(gl.POINTS,0,NP);gl.disableVertexAttribArray(L.s)}
    if(!reduce||g<1)kick();
  }
  kick();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&vis)kick()});
  return{setScroll(v){scroll=v;if(reduce)kick()}};
};
})();
