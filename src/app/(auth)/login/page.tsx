'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { User, Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/TextInput';
import { Toggle } from '@/components/ui/Toggle';
import { loginSchema, type LoginForm } from '@/schemas/loginSchema';
import { login } from '@/services/api/userService';

export default function LoginPage() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  const onLogin = async (data: LoginForm) => {
    setAuthError(false);
    const result = await login(data.email, data.password);
    if (result.success) {
      router.push(result.role === 'admin' ? '/admin/dashboard' : '/student/home');
    } else {
      setAuthError(true);
    }
  };

  const fillCredentials = (email: string, password: string) => {
    loginForm.setValue('email', email);
    loginForm.setValue('password', password);
  };

  return (
    <div className="login-shell">
      <div className="login-brand">
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '16px', marginTop: '70px', gap: '0%'}}>
          
          <Image
            src="/logo-ifome2.png"
            alt="Ícone do Restaurante Universitário"
            width={200}
            height={200}
            style={{ objectFit: 'contain', width: '38%', maxWidth: '200px', height: 'auto', flexShrink: 1 }}
          />
          
          <Image
            src="/ifome.png" 
            alt="Texto IFome"
            width={300}
            height={150}
            style={{ objectFit: 'contain', width: '58%', maxWidth: '300px', height: 'auto', flexShrink: 1 }}
          /> 
        </div>

    <div className="login-brand__detail col gap-12" style={{ alignItems: 'center' }}> 
  
  <span style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.15, fontFamily: 'var(--font-ui)', maxWidth: 460, textAlign: 'center' }}> {/* <-- Adicionado textAlign: 'center' */}
    O cardápio do RU, sempre na palma da mão.
  </span>
  
  <span style={{ fontSize: 16, opacity: .9, maxWidth: 460, textAlign: 'center' }}> 
    Confirme refeições, conheça os pratos do dia e ajude o restaurante universitário a reduzir o desperdício.
  </span>
  
 
  <div className="row gap-16" style={{ marginTop: 24, justifyContent: 'center' }}> 
    
    <div className="col" style={{ alignItems: 'center' }}> 
      <span className="mono" style={{ fontSize: 28, fontWeight: 700 }}>+18 mil</span>
      <span className="text-sm" style={{ opacity: .85 }}>Refeições / mês</span>
    </div>
    
    <div className="col" style={{ alignItems: 'center' }}> 
      <span className="mono" style={{ fontSize: 28, fontWeight: 700 }}>−24%</span>
      <span className="text-sm" style={{ opacity: .85 }}>Desperdício</span>
    </div>
    
  </div>
</div>

<div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 'auto' }}>
  <span className="login-brand__detail text-sm" style={{ opacity: .8, textAlign: 'center' }}>
    IFAL · Restaurante Universitário
  </span>
</div>
      </div>

  
      <div className="login-form">
  <div className="col gap-20" style={{ width: '100%', maxWidth: 380 }}>
    
    {/* Título e subtítulo agora são estáticos */}
    <div className="col gap-4">
      <span className="h-page">Entrar</span>
      <span className="muted">
        Use seu e-mail institucional para entrar.
      </span>
    </div>

    {authError && (
      <div className="row gap-8" style={{ background: 'var(--error-50)', color: 'var(--error)', padding: '10px 12px', borderRadius: 10, fontSize: 13 }}>
        <AlertCircle size={16} /> E-mail ou senha incorretos. Tente novamente.
      </div>
    )}

    {/* Formulário de Login (único formulário agora) */}
    <form onSubmit={loginForm.handleSubmit(onLogin)} className="col gap-16">
      <Field label="E-mail institucional" error={loginForm.formState.errors.email?.message}>
        <TextInput icon={User} type="email" placeholder="nome@ifal.edu.br" {...loginForm.register('email')} />
      </Field>
      <Field label="Senha" error={loginForm.formState.errors.password?.message}>
        <TextInput 
          icon={Lock} 
          type={showPassword ? 'text' : 'password'} 
          placeholder="••••••••" 
          trailingIcon={showPassword ? EyeOff : Eye}
          onTrailingIconClick={() => setShowPassword(!showPassword)}
          trailingIconAriaLabel={showPassword ? 'Esconder senha' : 'Ver senha'}
          {...loginForm.register('password')} 
        />
      </Field>
      <div className="between">
        <Toggle on={rememberMe} onChange={setRememberMe} label="Lembrar-me" />
        <span className="text-sm weight-500" style={{ color: 'var(--brand-text)', cursor: 'pointer' }}>Esqueci a senha</span>
      </div>
      <Button type="submit" variant="primary" size="lg" block disabled={loginForm.formState.isSubmitting}>
        {loginForm.formState.isSubmitting ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>


          {/* 
          <div className="col gap-8" style={{ padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
            <span className="text-xs weight-600 muted" style={{ textTransform: 'uppercase', letterSpacing: '.05em' }}>Credenciais de teste</span>
            <div className="between" style={{ alignItems: 'center' }}>
              <div className="col">
                <span className="text-xs weight-600">Aluno</span>
                <span className="text-xs muted mono">js@aluno.ifal.edu.br · 123456</span>
              </div>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => fillCredentials('js@aluno.ifal.edu.br', '123456')}
              >
                Preencher
              </button>
            </div>
            <div className="between" style={{ alignItems: 'center' }}>
              <div className="col">
                <span className="text-xs weight-600">Admin</span>
                <span className="text-xs muted mono">admin@ifal.edu.br · admin123</span>
              </div>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => fillCredentials('admin@ifal.edu.br', 'admin123')}
              >
                Preencher
              </button>
            </div>
          </div> */}

          <span className="text-xs muted center" style={{ marginTop: 4 }}>
            Visitantes podem consultar o cardápio sem login.{' '}
            <Link href="/guest" style={{ color: 'var(--brand-text)' }}>Ver cardápio →</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
