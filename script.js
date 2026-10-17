(function(){
  'use strict';
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav-links');
  if(toggle&&nav){
    toggle.addEventListener('click',()=>{const opened=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(opened));toggle.textContent=opened?'✕':'☰';});
    nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');toggle.textContent='☰';toggle.setAttribute('aria-expanded','false');}));
  }
  const cards=[...document.querySelectorAll('.service-card')];
  const filters=[...document.querySelectorAll('.filter')];
  filters.forEach(button=>button.addEventListener('click',()=>{
    const active=button.dataset.filter;
    filters.forEach(f=>{f.classList.toggle('active',f===button);f.setAttribute('aria-pressed',String(f===button));});
    cards.forEach(card=>{card.hidden=!(active==='all'||card.dataset.category===active);});
  }));
  const form=document.querySelector('#booking-form');
  const select=document.querySelector('#service');
  const date=document.querySelector('#date');
  const status=document.querySelector('#booking-status');
  function localToday(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  if(date)date.min=localToday();
  document.querySelectorAll('[data-book]').forEach(button=>button.addEventListener('click',()=>{
    if(select)select.value=button.dataset.book;
    document.querySelector('#booking')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    select?.focus({preventScroll:true});
  }));
  const modal=document.querySelector('#booking-preview');
  const pre=document.querySelector('#preview-message');
  function openModal(message){
    if(!modal||!pre)return;
    pre.textContent=message;
    modal.hidden=false;
    document.body.classList.add('modal-open');
    modal.querySelector('.preview-close')?.focus();
  }
  function closeModal(){if(modal)modal.hidden=true;document.body.classList.remove('modal-open');}
  const sampleMessage='Hello Your Clinic! 👋\n\nI would like to enquire about a consultation.\nService: Dental checkup (example)\nPreferred date: To be confirmed\nPreferred time: To be confirmed\n\nCould you please let me know your availability and fees?';
  document.querySelectorAll('[data-demo-whatsapp]').forEach(button=>button.addEventListener('click',()=>openModal(sampleMessage)));
  modal?.querySelectorAll('.preview-close,.preview-done').forEach(b=>b.addEventListener('click',closeModal));
  modal?.addEventListener('click',e=>{if(e.target===modal)closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  form?.addEventListener('submit',e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const d=String(data.get('date')||'');
    if(d<localToday()){status.textContent='Please select today or a future date.';date?.focus();return;}
    const fields=['service','date','time','name','contact'];
    const values=Object.fromEntries(fields.map(k=>[k,String(data.get(k)||'').trim()]));
    openModal(`Hello Your Clinic! 👋\n\nI would like to request an appointment.\n\nService: ${values.service}\nPreferred date: ${values.date}\nPreferred time: ${values.time}\nName: ${values.name}\nCallback number: ${values.contact}\n\nCould you confirm availability and price?`);
    status.textContent='Demo WhatsApp conversation generated locally. No message or personal information was sent.';
  });
  if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const items=document.querySelectorAll('[data-reveal]');items.forEach(n=>n.classList.add('reveal-ready'));
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.1});
    items.forEach(n=>observer.observe(n));
  }
})();