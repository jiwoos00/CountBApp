import ReactDOM from 'react-dom'
import App from './App'
import renderRoutes from './routes'
import './index.scss'

// app(루트 컴포넌트) 랜더링
ReactDOM.render(
  renderRoutes(App),
  document.getElementById('root')
)

// 핫 모듈 리플레이스먼트
// 웹팩이 제공하는 기능으로 모든 종류의 모듈들을 런타임 시점에 업데이트
if (module.hot) {
  module.hot.accept('./App.js', () => {
    const NextApp = require('./App').default
    ReactDOM.render(renderRoutes(NextApp), document.getElementById('root'))
    console.log('Hot module replaced..')
  })
}
