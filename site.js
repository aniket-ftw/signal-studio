window.dataLayer = window.dataLayer || [];
const track=(event,fields={})=>window.dataLayer.push({event,...fields});
let gtmId='';try{gtmId=localStorage.getItem('signal_studio_gtm')||''}catch{}
if(/^GTM-[A-Za-z0-9]+$/.test(gtmId)){
  window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(gtmId);document.head.append(script);
}
document.addEventListener('DOMContentLoaded',()=>{
  const $=id=>document.getElementById(id);
  function trackLink(element,event,eventName,fields){
    track(eventName,fields);
    if(element.tagName==='A' && !element.hasAttribute('download') && element.target!=='_blank' && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button===0){
      const destination=new URL(element.href,location.href);
      if(destination.origin===location.origin && destination.href!==location.href){event.preventDefault();setTimeout(()=>location.assign(destination.href),150)}
    }
  }
  document.querySelectorAll('[data-track]').forEach(element=>element.addEventListener('click',event=>trackLink(element,event,element.dataset.track,{link_text:element.textContent.trim().slice(0,80)})));
  document.querySelectorAll('[data-service]').forEach(element=>element.addEventListener('click',event=>trackLink(element,event,'select_service',{service_name:element.dataset.service})));
  const setup=$('gtm-setup');
  if(setup){
    const input=$('gtm-id');const status=$('gtm-status');
    if(gtmId){input.value=gtmId;status.textContent='Connected to '+gtmId+' in this browser.'}
    setup.addEventListener('submit',e=>{e.preventDefault();const value=input.value.trim().toUpperCase();if(!/^GTM-[A-Z0-9]+$/.test(value)){input.setCustomValidity('Enter a GTM ID such as GTM-ABC1234');input.reportValidity();return}input.setCustomValidity('');try{localStorage.setItem('signal_studio_gtm',value)}catch{}location.reload()});
    input.addEventListener('input',()=>input.setCustomValidity(''));
  }
  const phone=$('demo-phone');if(phone)phone.addEventListener('click',()=>{if(phone.dataset.shown)return;phone.dataset.shown='true';phone.textContent='Sample: (202) 555-0142';track('phone_reveal',{location:'contact'})});
  const form=$('contact-form');
  if(form)form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;track('form_submit',{form_id:'contact_demo'});try{sessionStorage.setItem('signal_studio_lead_pending','1')}catch{}setTimeout(()=>location.assign('contact.html?sent=1'),180)});
  if(new URLSearchParams(location.search).get('sent')==='1'){
    const success=$('success');if(success){success.classList.add('show');$('contact-form').hidden=true}
    let pending=false;try{pending=sessionStorage.getItem('signal_studio_lead_pending')==='1';sessionStorage.removeItem('signal_studio_lead_pending')}catch{}
    if(pending)track('generate_lead',{form_id:'contact_demo',lead_type:'practice'});
  }
});
