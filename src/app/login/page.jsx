import { LoginForm } from '@/features/auth/components/LoginForm';
import { LoginHero } from '@/features/auth/components/LoginHero';

export default function LoginPage() {
  return (
    <div
      className="relative flex flex-col min-h-screen w-full items-center justify-center px-4 py-20 text-foreground overflow-hidden bg-background"
    >
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <LoginHero />

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
