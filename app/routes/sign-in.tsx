import { json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/node'
import { createSupabaseServerClient } from '../lib/supabase.server'
export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(request)
  const formData = await request.formData()
  const { error } = await supabaseClient.auth.signInWithOtp({
    email: formData.get('email') as string,
    options: {
      emailRedirectTo: 'http://localhost:5173/auth/callback',
    },
  })
  // just for this example
  // if there is no error, we show "Please check you email" message
  if (error) {
    return json({ success: false }, { headers })
  }
  return json({ success: true }, { headers })
}
const SignIn = () => {
  const actionResponse = useActionData<typeof action>()
  return (
    <>
      {!actionResponse?.success ? (
        <Form method="post">
          <input type="email" name="email" placeholder="Your Email" required />
          <br />
          <button type="submit">Sign In</button>
        </Form>
      ) : (
        <h3>Please check your email.</h3>
      )}
    </>
  )
}
export default SignIn