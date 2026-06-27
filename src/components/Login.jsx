import { useEffect, useRef, useState } from 'react'
import './Login.css'

const VIEWS = {
  login: 'login',
  forgot: 'forgot',
  signup: 'signup',
}

const STACK_ROLES = {
  [VIEWS.login]: { front: VIEWS.login, left: VIEWS.forgot, right: VIEWS.signup },
  [VIEWS.forgot]: { front: VIEWS.forgot, left: VIEWS.login, right: VIEWS.signup },
  [VIEWS.signup]: { front: VIEWS.signup, left: VIEWS.login, right: VIEWS.forgot },
}

const CARD_LABELS = {
  [VIEWS.login]: 'Login',
  [VIEWS.forgot]: 'Reset Password',
  [VIEWS.signup]: 'Sign up',
}

const SWAP_MS = 500

function Login() {
  const [view, setView] = useState(VIEWS.login)
  const [swap, setSwap] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const hoverRef = useRef(false)
  const [isHovered, setIsHovered] = useState(false)
  const swapDoneRef = useRef(false)
  const swapTargetRef = useRef(null)

  const finishSwap = () => {
    if (swapDoneRef.current || !swapTargetRef.current) return
    swapDoneRef.current = true
    setView(swapTargetRef.current)
    setSwap(null)
    swapTargetRef.current = null
  }

  const changeView = (next) => {
    if (next === view || swap) return
    swapDoneRef.current = false
    swapTargetRef.current = next
    setSwap({ from: view, to: next })
  }

  useEffect(() => {
    if (!swap) return undefined
    const timer = window.setTimeout(finishSwap, SWAP_MS + 100)
    return () => window.clearTimeout(timer)
  }, [swap])

  const handleSwapEnd = (e) => {
    if (e.target !== e.currentTarget) return
    if (!swap || !e.animationName.startsWith('cardSwapIn')) return
    finishSwap()
  }

  const getThirdPanelClass = (panel, fromRoles, toRoles) => {
    const fromSide = panel === fromRoles.left ? 'left' : 'right'
    const toSide =
      panel === toRoles.left ? 'left' : panel === toRoles.right ? 'right' : null

    if (fromSide === 'left' && toSide === 'right') {
      return 'container container--swap-third container--third-left-to-right'
    }
    if (fromSide === 'right' && toSide === 'left') {
      return 'container container--swap-third container--third-right-to-left'
    }
    return fromSide === 'left'
      ? 'container container--back-left'
      : 'container container--back-right'
  }

  const getPanelClass = (panel) => {
    if (swap) {
      const fromRoles = STACK_ROLES[swap.from]
      const toRoles = STACK_ROLES[swap.to]

      if (panel === swap.from) {
        if (panel === toRoles.left) return 'container container--swap-out container--to-left'
        if (panel === toRoles.right) return 'container container--swap-out container--to-right'
        return 'container container--swap-out'
      }

      if (panel === swap.to) {
        if (panel === fromRoles.left) return 'container container--swap-in container--from-left'
        if (panel === fromRoles.right) return 'container container--swap-in container--from-right'
        return 'container container--swap-in'
      }

      return getThirdPanelClass(panel, fromRoles, toRoles)
    }

    const roles = STACK_ROLES[view]
    if (panel === roles.front) return 'container container--active'
    if (panel === roles.left) return 'container container--back-left'
    if (panel === roles.right) return 'container container--back-right'
    return 'container'
  }

  const cardProps = (panel) => {
    const roles = STACK_ROLES[view]
    const isBack = panel === roles.left || panel === roles.right

    if (!isBack || swap) return {}

    return {
      role: 'button',
      tabIndex: 0,
      'aria-label': `Switch to ${CARD_LABELS[panel]}`,
      onClick: () => changeView(panel),
      onKeyDown: (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          changeView(panel)
        }
      },
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    console.log({ username, password })
  }

  const handleForgot = (e) => {
    e.preventDefault()
    console.log({ email })
  }

  const handleSignup = (e) => {
    e.preventDefault()
    console.log({ signupName, email, signupPassword })
  }

  const linkProps = (next) => ({
    href: '#',
    onClick: (e) => {
      e.preventDefault()
      e.stopPropagation()
      changeView(next)
    },
  })

  return (
    <section className="login-section">
      <div className="box">
        <div
          className={`card-stack${swap ? ' card-stack--swapping' : ''}${isHovered ? ' card-stack--hovered' : ''}`}
          onMouseEnter={() => {
            hoverRef.current = true
            setIsHovered(true)
          }}
          onMouseLeave={() => {
            hoverRef.current = false
            setIsHovered(false)
          }}
        >
          <div className="form-deck">
            <div
              className={getPanelClass(VIEWS.login)}
              {...cardProps(VIEWS.login)}
              onAnimationEnd={handleSwapEnd}
            >
              <div className="form">
                <h2>Login Form</h2>
                <form onSubmit={handleLogin}>
                  <div className="inputBox">
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="inputBox">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="inputBox inputBox--submit">
                    <input type="submit" value="Login" />
                  </div>
                  <p className="forget">
                    Forget Password ?{' '}
                    <a {...linkProps(VIEWS.forgot)}>Click Here</a>
                  </p>
                  <p className="forget">
                    Don't have an account ?{' '}
                    <a {...linkProps(VIEWS.signup)}>Sign up</a>
                  </p>
                </form>
              </div>
            </div>

            <div
              className={getPanelClass(VIEWS.forgot)}
              {...cardProps(VIEWS.forgot)}
              onAnimationEnd={handleSwapEnd}
            >
              <div className="form">
                <h2>Reset Password</h2>
                <form onSubmit={handleForgot}>
                  <div className="inputBox">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="inputBox inputBox--submit">
                    <input type="submit" value="Send Reset" />
                  </div>
                  <p className="forget">
                    Remember your password ?{' '}
                    <a {...linkProps(VIEWS.login)}>Back to Login</a>
                  </p>
                </form>
              </div>
            </div>

            <div
              className={getPanelClass(VIEWS.signup)}
              {...cardProps(VIEWS.signup)}
              onAnimationEnd={handleSwapEnd}
            >
              <div className="form">
                <h2>Create Account</h2>
                <form onSubmit={handleSignup}>
                  <div className="inputBox">
                    <input
                      type="text"
                      placeholder="Username"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                  </div>
                  <div className="inputBox">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="inputBox">
                    <input
                      type="password"
                      placeholder="Password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                  </div>
                  <div className="inputBox inputBox--submit">
                    <input type="submit" value="Sign up" />
                  </div>
                  <p className="forget">
                    Already have an account ?{' '}
                    <a {...linkProps(VIEWS.login)}>Back to Login</a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
