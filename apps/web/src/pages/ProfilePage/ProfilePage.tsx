import { useNavigate } from 'react-router-dom'
import { useProfile } from '../../lib/api/hooks'
import { useAuth } from '../../lib/auth/AuthContext'
import { Button } from '../../components/atoms/Button'

export function ProfilePage() {
  const { data: profile, isLoading } = useProfile()
  const { signOut } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    void navigate('/login')
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="bg-card rounded-card p-8 w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-3xl font-semibold text-foreground">Perfil</h1>

        {isLoading ? (
          <p role="status" className="text-muted">
            Carregando…
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-foreground font-semibold">{profile?.name}</p>
            <p className="text-muted text-sm">{profile?.email}</p>
          </div>
        )}

        <Button variant="ghost" className="w-full" onClick={handleSignOut}>
          Sair
        </Button>
      </div>
    </div>
  )
}
