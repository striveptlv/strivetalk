import { createClient } from '@supabase/supabase-js'

type ProductAccess = {
  has_access: boolean | null
  access_type: string | null
  trial_ends_at: string | null
  subscription_status: string | null
}

type AccessRedirect = 'auth' | 'createTalk' | 'choosePlan'

const accessRedirects: Record<AccessRedirect, string> = {
  auth: '/auth.html',
  createTalk: '/auth.html?panel=createTalk',
  choosePlan: '/choose-plan.html?product=talk'
}

const resolveAppUrl = (path: string) => {
  const config = useRuntimeConfig()
  const baseURL = config.app.baseURL || '/'

  return new URL(path.replace(/^\//, ''), window.location.origin + baseURL).toString()
}

const redirectTo = (target: AccessRedirect) => {
  window.location.replace(resolveAppUrl(accessRedirects[target]))
}

const getSupabaseClient = () => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseAnonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase is missing NUXT_PUBLIC_SUPABASE_URL or NUXT_PUBLIC_SUPABASE_ANON_KEY')
    redirectTo('auth')
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export async function checkTalkAccess() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return false
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirectTo('auth')
    return false
  }

  const { data: access, error: accessError } = await supabase
    .from('product_access')
    .select('has_access, access_type, trial_ends_at, subscription_status')
    .eq('user_id', user.id)
    .eq('product', 'talk')
    .maybeSingle<ProductAccess>()

  if (accessError) {
    console.error('Talk access check failed:', accessError)
    redirectTo('auth')
    return false
  }

  if (!access) {
    redirectTo('createTalk')
    return false
  }

  const now = new Date()

  const trialActive
    = access.access_type === 'trial'
      && access.trial_ends_at
      && new Date(access.trial_ends_at) > now

  const paidActive
    = access.access_type === 'paid'
      && access.has_access === true
      && access.subscription_status !== 'canceled'

  const betaActive
    = access.access_type === 'beta'
      && access.has_access === true

  const teamActive
    = access.access_type === 'team'
      && access.has_access === true

  const adminActive
    = access.access_type === 'admin'
      && access.has_access === true

  const trialExpired
    = access.access_type === 'trial'
      && access.trial_ends_at
      && new Date(access.trial_ends_at) <= now

  if (trialExpired) {
    redirectTo('choosePlan')
    return false
  }

  if (!trialActive && !paidActive && !betaActive && !teamActive && !adminActive) {
    redirectTo('createTalk')
    return false
  }

  console.log('STRIVE Talk access approved')
  return true
}
