import numpy as np, soundfile as sf, json, re
SR=44100
vo,sr=sf.read('audio/vo.wav'); vo=vo.mean(1) if vo.ndim>1 else vo
src=open('web/shots.js').read()
spans=[(float(a),float(b),tr) for a,b,tr in re.findall(r"start:([\d.]+),end:([\d.]+),tr:'(\w+)'",src)]
END=spans[-1][1]; N=int(END*SR)+SR; out=np.zeros(N)
imp=[float(x) for x in re.search(r"IMPACTS=\[([^\]]*)\]",src).group(1).split(',')]
rng=np.random.default_rng(1)
def put(sig,t,g):
    i=int(t*SR); j=min(N,i+len(sig)); out[i:j]+=sig[:j-i]*g
def env(n,a=.005,d=None):
    t=np.arange(n)/SR; e=np.minimum(1,t/a); return e*np.exp(-t/(d or .1))
def whoosh(d=.28):
    n=int(d*SR); x=rng.standard_normal(n); t=np.linspace(0,1,n); f=np.sin(np.pi*t)**2
    # moving lowpass via cumulative smoothing
    y=np.zeros(n); a=0; 
    for i in range(n):
        k=.02+.25*t[i]; a+=k*(x[i]-a); y[i]=a
    return y*f*2.2
def boom(): n=int(.5*SR); t=np.arange(n)/SR; f=110*np.exp(-t*9)+40; return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.002,.16)+rng.standard_normal(n)*env(n,.001,.03)*.5
def pop(): n=int(.12*SR); t=np.arange(n)/SR; return np.sin(2*np.pi*np.cumsum(900-5000*t)/SR)*env(n,.001,.03)
def boing(): n=int(.7*SR); t=np.arange(n)/SR; f=220+90*np.sin(2*np.pi*14*t)*np.exp(-t*4); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.002,.25)
def pluck(freq,d=.6):
    n=int(d*SR); p=int(SR/freq); buf=rng.uniform(-1,1,p); y=np.zeros(n)
    for i in range(n): y[i]=buf[i%p]; buf[i%p]=.5*(buf[i%p]+buf[(i+1)%p])*.996
    return y
for a,b,tr in spans[:-1]:
    if tr=='whip': put(whoosh(),b-.16,.55)
for t in imp: put(boom(),t,.5)
for a,b,tr in spans:
    if src.find(f"start:{a:g}")>=0 and "polaroid" in src.split(f"start:{a:g}")[1].split("SHOTS.push")[0]: put(pop(),a+.08,.5)
put(boing(),16.35,.45)
# underscore: A minor plucks, 112 bpm eighths
notes=[220,261.6,329.6,261.6,196,246.9,293.7,246.9,174.6,220,261.6,220,164.8,207.7,246.9,329.6]
step=60/112/2; mus=np.zeros(N); t=0; k=0
while t<END:
    s=pluck(notes[k%16]*(2 if k%8==7 else 1)); i=int(t*SR); j=min(N,i+len(s)); mus[i:j]+=s[:j-i]*(.9 if k%2==0 else .55)
    if k%4==0:
        bn=int(.25*SR); tt=np.arange(bn)/SR; bs=np.sin(2*np.pi*55*tt)*env(bn,.003,.12); mus[i:i+bn]+=bs[:max(0,min(bn,N-i))]*.9
    t+=step; k+=1
# duck under voice
v=np.zeros(N); v[:len(vo)]=vo; e=np.abs(v); w=int(.08*SR); e=np.convolve(e,np.ones(w)/w,'same'); duck=1-.55*np.clip(e/ (e.max()*.25),0,1)
mix=v*1.0+out*.38*1.6+mus*.11*duck
fade=int(.4*SR); mix[-fade:]*=np.linspace(1,0,fade)
mix=mix/np.max(np.abs(mix))*.92
sf.write('audio/mix.wav',mix[:int(END*SR)],SR)
print('ok',END)
