export type AccessCode = {
  code: string
  expiresAt: string
  label: string
}

export const accessCodes: AccessCode[] = [
  {
    code: 'STRIVE30',
    expiresAt: '2026-07-05',
    label: 'Starter 30-day access'
  }
]
