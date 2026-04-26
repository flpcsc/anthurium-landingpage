'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

type FormData = {
  type: 'PF' | 'PJ' | ''
  name: string
  contactName: string
  origin: string
  email: string
  phone: string
}

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    type: '',
    name: '',
    contactName: '',
    origin: '',
    email: '',
    phone: '',
  })
  
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      setStep(0)
      setFormData({ 
        type: '', 
        name: '', 
        contactName: '', 
        origin: '', 
        email: '', 
        phone: '' 
      })
    }
    window.addEventListener('open-contact-modal', handleOpen)
    return () => window.removeEventListener('open-contact-modal', handleOpen)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
      gsap.fromTo(contentRef.current, { scale: 0.9, y: 20 }, { scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' })
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const close = () => {
    gsap.to(modalRef.current, { opacity: 0, duration: 0.3, onComplete: () => setIsOpen(false) })
  }

  const nextStep = () => setStep(s => s + 1)
  
  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11)
    setFormData(prev => ({ ...prev, phone: digits }))
  }

  const getDisplayPhone = () => {
    if (!formData.phone) return ''
    const d = formData.phone
    if (d.length <= 2) return `(${d}`
    return `(${d.slice(0, 2)}) ${d.slice(2)}`
  }

  const submit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStep(5) // Success step
      } else {
        alert('Erro ao enviar. Tente novamente.')
      }
    } catch (err) {
      console.error(err)
      alert('Erro de conexão.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 10, 5, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '2rem',
      }}
      onClick={close}
    >
      <div
        ref={contentRef}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '500px',
          background: '#0a1a0f',
          border: '1px solid rgba(46, 204, 113, 0.1)',
          borderRadius: '24px',
          padding: 'clamp(2rem, 5vw, 3rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Step 0: Type */}
        {step === 0 && (
          <div className="gpu">
            <h3 className="display-sm" style={{ color: '#fff', marginBottom: '2rem' }}>Seja bem-vindo.</h3>
            <p className="body-md" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>
              Como podemos te identificar?
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="magnetic-btn"
                onClick={() => { setFormData(p => ({ ...p, type: 'PF' })); nextStep() }}
                style={{ flex: 1, padding: '1.5rem', fontSize: '0.8rem' }}
              >
                Pessoa Física
              </button>
              <button
                className="magnetic-btn"
                onClick={() => { setFormData(p => ({ ...p, type: 'PJ' })); nextStep() }}
                style={{ flex: 1, padding: '1.5rem', fontSize: '0.8rem' }}
              >
                Pessoa Jurídica
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Name / Company Name */}
        {step === 1 && (
          <div className="gpu">
            <h3 className="display-sm" style={{ color: '#fff', marginBottom: '1.5rem' }}>
              {formData.type === 'PF' ? 'Qual seu nome?' : 'Qual o nome da empresa?'}
            </h3>
            <input
              autoFocus
              type="text"
              placeholder="Digite aqui..."
              value={formData.name}
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && formData.name.length > 2 && (formData.type === 'PJ' ? setStep(6) : setStep(2))}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                fontSize: '1.5rem',
                color: '#2ECC71',
                padding: '1rem 0',
                outline: 'none',
              }}
            />
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="magnetic-btn"
                disabled={formData.name.length < 3}
                onClick={() => formData.type === 'PJ' ? setStep(6) : setStep(2)}
                style={{ opacity: formData.name.length < 3 ? 0.3 : 1 }}
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Contact Name for PJ */}
        {step === 6 && (
          <div className="gpu">
            <h3 className="display-sm" style={{ color: '#fff', marginBottom: '1.5rem' }}>E o seu nome?</h3>
            <input
              autoFocus
              type="text"
              placeholder="Digite aqui..."
              value={formData.contactName}
              onChange={e => setFormData(p => ({ ...p, contactName: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && formData.contactName.length > 2 && setStep(2)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                fontSize: '1.5rem',
                color: '#2ECC71',
                padding: '1rem 0',
                outline: 'none',
              }}
            />
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="magnetic-btn"
                disabled={formData.contactName.length < 3}
                onClick={() => setStep(2)}
                style={{ opacity: formData.contactName.length < 3 ? 0.3 : 1 }}
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Origin */}
        {step === 2 && (
          <div className="gpu">
            <h3 className="display-sm" style={{ color: '#fff', marginBottom: '2rem' }}>Onde conheceu a gente?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              {['Google Maps', 'Google Search', 'Redes Sociais', 'Indicação', 'Eventos', 'Outros'].map(opt => (
                <button
                  key={opt}
                  className="magnetic-btn"
                  onClick={() => { setFormData(p => ({ ...p, origin: opt })); setStep(3) }}
                  style={{ 
                    padding: '1rem', 
                    fontSize: '0.7rem',
                    background: formData.origin === opt ? 'rgba(46, 204, 113, 0.1)' : 'transparent'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Email */}
        {step === 3 && (
          <div className="gpu">
            <h3 className="display-sm" style={{ color: '#fff', marginBottom: '1.5rem' }}>E o seu e-mail?</h3>
            <input
              autoFocus
              type="email"
              placeholder="exemplo@email.com"
              value={formData.email}
              onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && formData.email.includes('@') && nextStep()}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                fontSize: '1.5rem',
                color: '#2ECC71',
                padding: '1rem 0',
                outline: 'none',
              }}
            />
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="magnetic-btn"
                disabled={!formData.email.includes('@')}
                onClick={nextStep}
                style={{ opacity: !formData.email.includes('@') ? 0.3 : 1 }}
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Phone */}
        {step === 4 && (
          <div className="gpu">
            <h3 className="display-sm" style={{ color: '#fff', marginBottom: '1.5rem' }}>Seu melhor contato</h3>
            <p className="body-sm" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
              Digite o DDD + número (exato 11 dígitos)
            </p>
            <input
              autoFocus
              type="tel"
              placeholder="(00) 000000000"
              value={getDisplayPhone()}
              onChange={e => handlePhoneChange(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                fontSize: '2rem',
                color: '#2ECC71',
                padding: '1rem 0',
                outline: 'none',
                letterSpacing: '0.1em',
              }}
            />
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="magnetic-btn"
                disabled={formData.phone.length !== 11 || isSubmitting}
                onClick={submit}
                style={{ opacity: formData.phone.length !== 11 ? 0.3 : 1 }}
              >
                {isSubmitting ? 'Enviando...' : 'Finalizar'}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <div className="gpu" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'rgba(46, 204, 113, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 2rem',
              color: '#2ECC71',
              fontSize: '2rem'
            }}>
              ✓
            </div>
            <h3 className="display-sm" style={{ color: '#fff', marginBottom: '1rem' }}>Entraremos em contato</h3>
            <p className="body-md" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '3rem' }}>
              Em breve um especialista da Anthurium falará com você.
            </p>
            <button className="magnetic-btn" onClick={close}>
              Fechar
            </button>
          </div>
        )}

        {/* Close Button UI */}
        {step < 5 && (
          <button
            onClick={close}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              fontSize: '1.5rem',
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
