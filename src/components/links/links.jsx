import React, { PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import { formatPattern } from 'react-router/lib/PatternUtils'
import resolve from 'resolve-pathname'

const { oneOfType, shape, object, string, func, array } = React.PropTypes

const relativeLinksContextType = {
  relativeLinks: shape({
    params: object.isRequired,
    route: object.isRequired,
    routes: array.isRequired
  }).isRequired
}

const isAbsolute = to => to.match(/^\//)

const constructRoutePattern = (currentRoute, routes) => {
  let fullPath = ''

  for (const route of routes) {
    const { path } = route

    if (path) {
      if (path[0] === '/') {
        fullPath = path
      } else {
        // If the first path-ed route has no leading slash, then this will add it.
        if (fullPath[fullPath.length - 1] !== '/') {
          fullPath += '/'
        }

        fullPath += path
      }
    }

    if (route === currentRoute) {
      break
    }
  }

  return fullPath
}

const resolvePathname = ({ relativePath, route, routes, params }) => {
  const patternUpToRoute = constructRoutePattern(route, routes)
  // TODO: remove trailing slash hack
  // we add a slash cause it's SUPER WEIRD if we don't, should add an option
  // to history to always use trailing slashes to not do this and cause
  // confusion for people who actually know how browsers resolve urls :P
  const specialCase = relativePath.trim() === ''
  const slash = specialCase ? '' : '/'
  const resolvedPattern = resolve(`${relativePath}${slash}`, `${patternUpToRoute}/`)
  const withoutSlash = resolvedPattern.substring(0, resolvedPattern.length - 1)
  return formatPattern(withoutSlash, params)
}

// TODO: De-duplicate against hasAnyProperties in createTransitionManager.
const isEmptyObject = (object) => {
  for (const p in object)
    if (Object.prototype.hasOwnProperty.call(object, p))
      return false

  return true
}

const RelativeLink = React.createClass({

  propTypes: {
    to: oneOfType([ string, object ]).isRequired
  },

  contextTypes: { ...relativeLinksContextType, router: PropTypes.object },

  getInitialState() {
    return { to: this.calculateTo(this.props) }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.to !== this.props.to) {
      this.setState({ to: this.calculateTo(nextProps) })
    }
  },

  handlerClick(event) {
    if (event.defaultPrevented)
      return
    event.preventDefault()

    this.context.router.replace(this.state.to)
    // const { to, replace} = this.props
    // replace ? this.context.router.replace(this.state.to) :
    //           this.context.router.push(this.state.to);
  },

  calculateTo(props) {
    const { to } = props
    const { route, routes, params } = this.context.relativeLinks
    const isLocationDescriptor = typeof to === 'object'
    const relativePath = isLocationDescriptor ? to.pathname || '' : to
    const resolved = isAbsolute(relativePath) ? relativePath :
      resolvePathname({ relativePath, route, routes, params })
    return isLocationDescriptor ? { ...to, pathname: resolved } : resolved
  },

  render() {
    const { to, replace, activeClassName, activeStyle, ...props } = this.props

    if (activeClassName || (activeStyle != null && !isEmptyObject(activeStyle))) {
      const routes = this.context.relativeLinks.routes;
      const reg = /[\/\.]*(\w+)(\/)?(.*)/g;
      const pathname = to.replace(reg, '$1');

      if(routes[routes.length-1].path.indexOf(pathname) > -1) {
        if (props.className) {
          props.className += ` ${activeClassName}`
        } else {
          props.className = activeClassName
        }

        if (activeStyle) {
            props.style = { ...props.style, ...activeStyle }
        }
      }
    }

    return <a href="javascript:;" { ...props } onClick={ this.handlerClick } />
  }
})

export default RelativeLink;
