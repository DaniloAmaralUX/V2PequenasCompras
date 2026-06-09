import { create } from 'zustand'
import { roles, defaultRole, type Role } from '@/config/roles'
import { getCookie, setCookie } from '@/lib/cookies'

/**
 * Store mock do papel ativo (prototipação).
 * Persistido em cookie, espelhando o padrão dos demais providers do template.
 * Substituir por papéis reais quando a autenticação for definida (fora do MVP).
 */
const ROLE_COOKIE = 'mock_role'
const ROLE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 ano

function readInitialRole(): Role {
  const saved = getCookie(ROLE_COOKIE)
  return roles.includes(saved as Role) ? (saved as Role) : defaultRole
}

type MockRoleState = {
  role: Role
  setRole: (role: Role) => void
}

export const useMockRoleStore = create<MockRoleState>((set) => ({
  role: readInitialRole(),
  setRole: (role) => {
    setCookie(ROLE_COOKIE, role, ROLE_COOKIE_MAX_AGE)
    set({ role })
  },
}))

/** Atalho de leitura do papel ativo. */
export const useMockRole = () => useMockRoleStore((s) => s.role)
