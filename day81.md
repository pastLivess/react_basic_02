# day81

# jsx语法(二)

## React事件监听与解决this绑定

![image-20230311153012941](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230311153012941.png)

~~~~jsx
/*
         this绑定规则
           1.默认绑定  例:独立执行 foo()
           2.隐式绑定  例:被一个对象绑定 obj.foo()
           3.显式绑定  例:通过call/apply/bind obj.call(obj)
           4.new绑定  例:创建一个新对象 把this指向该构造函数 new Foo()
       */
      function foo() {
        console.log(this)
      }
      const obj = {}

      obj.foo = foo
      const click = obj.foo
      click() // 独立调用 是window


  class App extends React.Component {
        constructor() {
          super()
          this.state = {
            message: 'hello world',
          }
        }
        changeMessage() {
          console.log(this)
        }
        render() {
          return (
            <div>
              <h2>{this.state.message}</h2>
              {/* react通过onXxxx 进行绑定事件 
              render函数中this能访问到当前的类 this.changeMessage 就是上面这个函数
              但是这个函数中在这里的this,内部应该是进行独立调用的 他指向的是undefined 需要我们进行手动绑定 */}
              <button onClick={this.changeMessage}>修改message</button>
              {/* 绑定方式二 ES6 class fields  */}
              <button onClick={this.changeMessage2}>按钮2</button>
              {/* 绑定方式三 直接传入一个箭头函数  */}
              <button onClick={() => console.log(this)}>按钮3</button>
              {/* 箭头函数中能够访问到当前类 箭头函数中访问this 而箭头函数没有自己this 
              this.changeMessage3就指向当前类  */}
              <button onClick={() => this.changeMessage3()}>按钮4</button>
            </div>
          )
        }
      }
      const root = ReactDOM.createRoot(document.querySelector('#root'))
      root.render(<App />)
~~~~

## React事件对象与传递参数

~~~~jsx

    <script type="text/babel">
      class App extends React.Component {
        constructor() {
          super()
          this.state = {
            message: 'hello world',
          }
        }
        btnClick(e) {
          console.log(e)
        }
        btnClick2(event, a, b, c) {
          console.log(event, a, b, c)
        }
        btnClick3(a, b, c, event) {
          console.log(a, b, c, event)
        }
        render() {
          return (
            <div>
              <h2>{this.state.message}</h2>

              {/* event参数的传递 默认情况下没有传递参数 第一个值就是event对象 */}
              <button onClick={this.btnClick}>修改message</button>

              {/*使用箭头函数传递参数 event对象可以传递给里面的函数 并且携带参数一起调用该函数(掌握) */}
              <button
                onClick={(event) => {
                  this.btnClick2(event, 1, 2, 3)
                }}
              >
                修改message
              </button>
              {/* 使用bind绑定时,绑定event并传参 event对象是最后一个形参 */}
              <button onClick={this.btnClick3.bind(this, 1, 2, 3)}>修改message</button>
            </div>
          )
        }
      }
      const root = ReactDOM.createRoot(document.querySelector('#root'))
      root.render(<App />)
~~~~

## 电影列表active的案例三种写法

~~~~jsx
 <style>
      .active {
        color: red;
        font-size: 22px;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      class App extends React.Component {
        constructor() {
          super()
          this.state = {
            movies: ['唱', '跳', 'rap'],
            currentIndex: 0,
          }
        }
        changeIndex(index) {
          this.setState({
            currentIndex: index,
          })
        }
        render() {
          const { movies, currentIndex } = this.state
          return (
            <div>
              <ul>
                 {/* 1. {} jsx语法中允许写表达式 movies遍历该函数 map方法返回一个处理好元素后的数组 */}
                {movies.map((item, index) => {
                  return (
                    <li
                 {/* 2.jsx中绑定class使用classname属性 class是定义类的,
                 currentIndex是state中的值,index是遍历的值,相等时添加active类 */}
                      className={currentIndex === index ? 'active' : ''}
                        {/*3. 循环需要绑定key */}
                      key={item}
                     {/*4. 箭头函数,使用箭头函数的原因,react内部在调用时,
                     是默认调用,如果不使用箭头函数this会指向undefined,调用this.changeIndex函数并传入index */}
                      onClick={() => this.changeIndex(index)}
                    >
                      {item}
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        }
      }
      const root = ReactDOM.createRoot(document.querySelector('#root'))
      root.render(<App />)
    </script>
  </body>
</html>

~~~~

### 重构一

~~~~jsx
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../lib/react.development.js"></script>
    <script src="../lib/react-dom.development.js"></script>
    <script src="../lib/babel.min.js"></script>
    <style>
      .active {
        color: red;
        font-size: 22px;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      class App extends React.Component {
        constructor() {
          super()
          this.state = {
            movies: ['唱', '跳', 'rap'],
            currentIndex: 0,
          }
        }
        changeIndex(index) {
          this.setState({
            currentIndex: index,
          })
        }
        render() {
          const { movies, currentIndex } = this.state
          // 将整个表达式抽取到这里来, 下面jsx插值会把数组中每个元素都取来的
          const liEls = movies.map((item, index) => {
            return (
              <li className={currentIndex === index ? 'active' : ''} key={item} onClick={() => this.changeIndex(index)}>
                {item}
              </li>
            )
          })
          return (
            <div>
              <ul>{liEls}</ul>
            </div>
          )
        }
      }
      const root = ReactDOM.createRoot(document.querySelector('#root'))
      root.render(<App />)
    </script>
  </body>
</html>

~~~~

### 重构二

~~~~jsx
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../lib/react.development.js"></script>
    <script src="../lib/react-dom.development.js"></script>
    <script src="../lib/babel.min.js"></script>
    <style>
      .active {
        color: red;
        font-size: 22px;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      class App extends React.Component {
        constructor() {
          super()
          this.state = {
            movies: ['唱', '跳', 'rap'],
            currentIndex: 0,
          }
        }
        changeIndex(index) {
          this.setState({
            currentIndex: index,
          })
        }
        render() {
          const { movies, currentIndex } = this.state
          // 抽取成一个函数 下面调用map方法 传入该函数 注意这里得是箭头函数 不然this又是有问题
          const handlerItem = (item, index) => {
            return (
              <li className={currentIndex === index ? 'active' : ''} key={item} onClick={() => this.changeIndex(index)}>
                {item}
              </li>
            )
          }

          return (
            <div>
              <ul>{movies.map(handlerItem)}</ul>
            </div>
          )
        }
      }
      const root = ReactDOM.createRoot(document.querySelector('#root'))
      root.render(<App />)
    </script>
  </body>
</html>

~~~~

## 条件渲染常见三种方式

~~~~jsx
<body>
    <div id="root"></div>
    <script type="text/babel">
      class App extends React.Component {
        constructor() {
          super()
          this.state = {
            message: 'hello world',
            isReady: true,
            hobby: ['唱', '跳', 'rap'],
          }
        }
        render() {
          const { message, isReady, hobby } = this.state
          
          // if语句 并将结果赋值给一个变量
          let showElement = null
          if (isReady) {
            showElement = <h2>准备开始吧</h2>
          } else {
            showElement = <h2>请做好准备</h2>
          }
          return (
            <div>
                  
              {/* 方式二:  使用if语句 */}
              <div>{showElement}</div>
              {/* 方式二:  使用三元运算符 适合逻辑比较少的情况 */}
              <div>{isReady ? <h2>true</h2> : <h2>false</h2>}</div>

              {/* 方式三:  逻辑与 第一个为真 才会进行后面操作 否则中断 */}
              <div>{hobby && hobby[0] + hobby[1] + hobby[2]}</div>
            </div>
          )
        }
      }
      const root = ReactDOM.createRoot(document.querySelector('#root'))
      root.render(<App />)
    </script>
  </body>
</html>

~~~~

## 条件渲染案例

~~~~jsx
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../lib/react.development.js"></script>
    <script src="../lib/react-dom.development.js"></script>
    <script src="../lib/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      class App extends React.Component {
        constructor() {
          super()
          this.state = {
            message: 'hello react',
            num: 0,
            isShow: true,
          }
        }
        changeShow() {
          this.setState({
            isShow: !this.state.isShow,
          })
        }
        render() {
          const { message, num, isShow } = this.state

          let style = null
          if (isShow) {
            style = 'block'
          } else {
            style = 'none'
          }
          return (
            <div>
              <button onClick={() => this.changeShow()}>切换</button>
                  
                  {/*  isShow为true 且message存在才会显示 类似于v-if */}
              <h2>{isShow && message}</h2
                  
                  {/* 
                   style只能绑定对象 所以jsx里插入一个对象 有display属性 他的值是通过if else绑定的
                   实现效果类似于vue中的v-show 如果为ture 则显示 为false 则进行display:none
                  */}
              <h2 style={{ display: style }}>{num}</h2>
            </div>
          )
        }
      }
      const root = ReactDOM.createRoot(document.querySelector('#root'))
      root.render(<App />)
    </script>
  </body>
</html>

~~~~

## 列表渲染中高阶函数的使用

![image-20230311173132802](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230311173132802.png)

~~~~jsx
 <script type="text/babel">
      class App extends React.Component {
        constructor() {
          super()
          this.state = {
            students: [
              { id: 111, name: 'jonas', score: 90 },
              { id: 123, name: 'jack', score: 55 },
              { id: 134, name: 'tom', score: 66 },
              { id: 144, name: 'james', score: 99 },
            ],
          }
        }
        render() {
          const { students } = this.state
          return (
            <div>
              <h2>学生列表</h2>
              <div className="content">
                  // jsx中写了函数链式调用 选出成绩>60的 挑选出前两个进行展示
                {students
                  .filter((item) => item.score > 60)
                  .slice(0, 2)
                  .map((item) => {
                    return (
                      <ul className="list" key={item.id}>
                        <li className="item">id:{item.id}</li>
                        <li className="item">name:{item.name}</li>
                        <li className="item">score:{item.score}</li>
                      </ul>
                    )
                  })}
              </div>
            </div>
          )
        }
      }
      const root = ReactDOM.createRoot(document.querySelector('#root'))
      root.render(<App />)
    </script>
  </body>
</html>

~~~~

## jsx的本质



![image-20230311175952195](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230311175952195.png)

### createElement源码

![image-20230311180010541](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230311180010541.png)

### jsx未经过babel转换的代码

~~~~jsx
<div className="header">
	<div className="Content">
      <div>banner</div>
      <ul>
        <li>唱</li>
        <li>跳</li>
        <li>rap</li>
      </ul>
</div>
</div>
~~~~

![image-20230311180746106](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230311180746106.png)

~~~~js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../lib/react.development.js"></script>
    <script src="../lib/react-dom.development.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script>
      class App extends React.Component {
        constructor() {
          super()
        }

        render() {
            // 不需要babel即可运行 只不过这种写法很难写,也不好记,所以我们要用到babel
          const element = /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'header',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'Content',
              },
              /*#__PURE__*/ React.createElement('div', null, 'banner'),
              /*#__PURE__*/ React.createElement(
                'ul',
                null,
                /*#__PURE__*/ React.createElement('li', null, '\u5531'),
                /*#__PURE__*/ React.createElement('li', null, '\u8DF3'),
                /*#__PURE__*/ React.createElement('li', null, 'rap')
              )
            )
          )

          return element
        }
      }
      const root = ReactDOM.createRoot(document.querySelector('#root'))
      root.render(React.createElement(App, null))
    </script>
  </body>
</html>

~~~~

![image-20230311181349926](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230311181349926.png)

## 虚拟DOM到真实DOM的过程

### 虚拟DOM的创建过程

![image-20230311181945485](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230311181945485.png)

![image-20230311182254996](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230311182254996.png)

### 虚拟DOM的作用

最主要的两个作用

**1.虚拟DOM本质上是js对象 , 虚拟DOM内部有diff算法,js对象里会比较新旧DOM,让不同的那部分更新,其他不更新 性能消费更低** 

**2.跨平台 虚拟DOM本质上是js对象 可以放在其他平台上, 进行渲染成其他端(uni app/react native/flutter)**

### 声明式编程

**虚拟DOM帮我们从命令式编程(需要对DOM一步一步操作)转到了声明式编程(定义数据 直接在模板上进行显示)**

![image-20230311183401860](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230311183401860.png)

![image-20230311183618075](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230311183618075.png)

# 购物车案例

### 1.展示列表

~~~~Jsx
	<script src="./data.js"></script>
    <style>
      table {
        border-collapse: collapse;
      }
      td,
      th {
        padding: 10px 16px;
        border: 1px solid black;
      }
      button {
        margin: 0 3px;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      class App extends React.Component {
        constructor() {
          super()
          this.state = {
            books,
          }
        }
        render() {
          const { books } = this.state

          return (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>书籍名称</th>
                    <th>出版日期</th>
                    <th>价格</th>
                    <th>购买数量</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((item, index) => {
                        // 循环的使用要求返回容器时必须只有一个根容器
                    return (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.date}</td>
                        <td>{item.price}</td>
                        <td>
                          <button>-</button>
                          {item.count}
                          <button>+</button>
                        </td>
                        <td>
                          <button>移除</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table
            </div>
          )
        }
      }
      const root = ReactDOM.createRoot(document.querySelector('#root'))
      root.render(<App />)
    </script>
  </body>
</html>

~~~~

### 2.计算总价格与格式化钱数

~~~~js
format.js

function formatPrice(price) {
  return ('$' + Number(price)).toFixed(2)
}


    <script src="./format.js"></script> 

render() {
          const { books } = this.state
          // 高阶函数求总价格
          const totalPrice = books.reduce((prev, item) => {
            return (prev += item.count * item.price)
          }, 0)

          return (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>书籍名称</th>
                    <th>出版日期</th>
                    <th>价格</th>
                    <th>购买数量</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.date}</td>
                        <td>{formatPrice(item.price)}</td>
                        <td>
                          <button>-</button>
                          {item.count}
                          <button>+</button>
                        </td>
                        <td>
                          <button>移除</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <h2>总价格:{formatPrice(totalPrice)}</h2>
            </div>
          )
        }
      }
~~~~

### 3.商品加减

~~~~jsx
<script type="text/babel">
      class App extends React.Component {
        constructor() {
          super()
          this.state = {
            books,
          }
        }
        // 调用该函数 react不允许我们对数组这个本身进行操作,
        // 1.我们需要解构出来该对象 对解构的对象进行操作之后把值赋值回原对象即可
        changeCount(index, count) {
          const newBooks = [...this.state.books]
          newBooks[index].count += count
          this.setState({ books: newBooks })
        }
        render() {
          const { books } = this.state
          // 总价格
          const totalPrice = books.reduce((prev, item) => {
            return (prev += item.count * item.price)
          }, 0)
          return (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>书籍名称</th>
                    <th>出版日期</th>
                    <th>价格</th>
                    <th>购买数量</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.date}</td>
                        <td>{formatPrice(item.price)}</td>
                        <td>
                           {/*disabled进行判断 物品1或者更少禁用按钮  减法调用这个函数 传入index与-1*/}
                          <button disabled={item.count <= 1} onClick={() => this.changeCount(index, -1)}>
                            -
                          </button>
                          {item.count}
                                 {/*  减法调用这个函数 传入index与 1 */}
                          <button onClick={() => this.changeCount(index, 1)}>+</button>
                        </td>
                        <td>
                          <button>移除</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <h2>总价格:{formatPrice(totalPrice)}</h2>
            </div>
          )
        }
      }
      const root = ReactDOM.createRoot(document.querySelector('#root'))
      root.render(<App />)
    </script>
  </body>
</html>

~~~~

### 4.删除商品与代码重构

~~~~jsx
<script type="text/babel">
      class App extends React.Component {
        constructor() {
          super()
          this.state = {
            books,
          }
        }
        changeCount(index, count) {
          const newBooks = [...this.state.books]
          newBooks[index].count += count
          this.setState({ books: newBooks })
        }
        // 删除商品的函数
        removeItem(index) {
          // 不要直接对源数据进行修改 filter这里不会修改原数组,会返回一个新的数组
          // 把原数组返回即可
          // filter实现
          const newBooks = this.state.books.filter((item, inden) => index !== inden)
          this.setState({ books: newBooks })
          // splice实现
          // const newBooks = [...this.state.books]
          // newBooks.splice(index, 1)
          // this.setState({ books: newBooks })
        }
        // 计算总价格的函数
        totalPrice() {
          return this.state.books.reduce((prev, item) => {
            return (prev += item.count * item.price)
          }, 0)
        }
        //1. 渲染书籍的内容封装为一个函数
        renderBookList() {
          const { books } = this.state

          return (
            <div>
              <div className="content">
                <table>
                  <thead>
                    <tr>
                      <th>序号</th>
                      <th>书籍名称</th>
                      <th>出版日期</th>
                      <th>价格</th>
                      <th>购买数量</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((item, index) => {
                      return (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.date}</td>
                          <td>{formatPrice(item.price)}</td>
                          <td>
                            <button disabled={item.count <= 1} onClick={() => this.changeCount(index, -1)}>
                              -
                            </button>
                            {item.count}
                            <button onClick={() => this.changeCount(index, 1)}>+</button>
                          </td>
                          <td>
                            <button onClick={() => this.removeItem(index)}>移除</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <h2>总价格:{formatPrice(this.totalPrice())}</h2>
              </div>
            </div>
          )
        }
        //2.书籍为空的函数 当购物车被清空时调用这个函数
        renderBookEmpty() {
          return (
            <div>
              <h2>购物车列表为空!</h2>
            </div>
          )
        }
        
        render() {
            // 3.判断books的长度 如果存在 就调用渲染模板的函数
          if (this.state.books.length) {
            return this.renderBookList()
              // 4. 如果长度为空 调用 renderBookEmpty函数
          } else {
            return this.renderBookEmpty()
          }
        }
      }
      const root = ReactDOM.createRoot(document.querySelector('#root'))
      root.render(<App />)
    </script>
  </body>
</html>

~~~~

# react脚手架

## 前端工程化的复杂化

![image-20230311212109114](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230311212109114.png)

## 脚手架

![image-20230311212141325](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230311212141325.png)

## 前端框架脚手架

![image-20230311212155558](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230311212155558.png)

![image-20230311212313416](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230311212313416.png)

## 创建react项目

1.全局安装脚手架

npm i create-react-app -g

2.查看脚手架版本

create-react-app --version

3.创建项目 项目名字不能有大写字母

create-react-app xxx

4.启动和打包查看page.json文件夹

## react脚手架目录介绍

1.node_modules 存放第三方库的依赖

2.public

- 存放index(模板文件)等文件 

- favicon 网站页签图标

- PWA

- ![image-20230312005725557](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230312005725557.png)

- robots 希望被爬虫或不希望?

  

3.src 存放源代码等

4.package-lock.json 存放依赖的真实版本,与缓存依赖等

5.package.json 存放各种依赖与启动等配置项

### 了解PWA(国内公司基本没有)

了解即可

![image-20230312005748141](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230312005748141.png)

​	![image-20230312011915805](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230312011915805.png)

## 从零开始搭建项目

![image-20230312024812691](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230312024812691.png)

index.js

~~~~jsx
// ReactDOM函数 React18之后 需要从这里引入 react-dom/client
import ReactDOM from 'react-dom/client'
// 引入App组件
import App from './App'
// 选中容器
const root = ReactDOM.createRoot(document.getElementById('root'))
// 渲染App组件
root.render(<App />)

~~~~

App.jsx

~~~~jsx
import React from 'react'
// 引入子组件
import HelloWorld from './components/HelloWorld'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      message: 'hello react',
    }
  }
  render() {
    return (
      <div>
        <HelloWorld /> // 渲染组件
      </div>
    )
  }
}
// 每个组件都是一个模块 最终都要暴露出去
export default App

~~~~

HelloWorld.jsx

~~~~jsx
import React from 'react'

class HelloWorld extends React.Component {
  render() {
    return (
      <div>
        <h2>hello world</h2>
      </div>
    )
  }
}

export default HelloWorld // 导出组件

~~~~

## 查看React的webpack配置(了解)

![image-20230312025150028](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230312025150028.png)

![image-20230312025204978](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230312025204978.png)

# 总结

## 一. 完成课堂所有的代码



## 二. JSX绑定事件，this绑定有哪些规则？如何给函数传递参数？

~~~~jsx
/*
         this绑定规则
           1.默认绑定  例:独立执行 foo()
           2.隐式绑定  例:被一个对象绑定 obj.foo()
           3.显式绑定  例:通过call/apply/bind obj.call(obj)
           4.new绑定  例:创建一个新对象 把this指向该构造函数 new Foo()
       */
      function foo() {
        console.log(this)
      }
      const obj = {}

      obj.foo = foo
      const click = obj.foo
      click() // 独立调用 是window


  class App extends React.Component {
        constructor() {
          super()
          this.state = {
            message: 'hello world',
          }
        }
        changeMessage() {
          console.log(this)
        }
        changeMessage3(e,a,b,c){
          console.log(this,e,a,b,c)
       } 
        render() {
          return (
            <div>
              <h2>{this.state.message}</h2>
              {/* changeMessage函数中在这里的this,内部应该是进行独立调用的 他指向的是undefined 需要我们进行手动绑定 */}
              <button onClick={this.changeMessage}>修改message</button>
              {/* 绑定方式二 ES6 class fields(了解) changeMessage2是一个箭头函数  */}
              <button onClick={this.changeMessage2}>按钮2</button>
              {/* 箭头函数中能够访问到当前类 箭头函数中访问this 而箭头函数没有自己this  (重要)
              this.changeMessage3就指向当前类  给函数传递参数(可以通过第一个变量)  */}
              <button onClick={(e) => this.changeMessage3(e,1,2,3)}>按钮4</button>
            </div>
          )
        }
      }
      const root = ReactDOM.createRoot(document.querySelector('#root'))
      root.render(<App />)
~~~~







## 三. JSX的代码是如何被编译为React代码的？它的本质是进行什么操作？

jsx代码本质上是通过React.createElement函数帮我们创建节点的 

不需要babel的情况下,也是可以书写react原生语法 就是React.createElement函数,但是会很麻烦,所以我们使用babel进行编译

下面就是babel帮我们做的事.

例**<div className="active"><h2>你好</h2></div>**  

React.createElement('div',{className:'active'},[

React.createElement('h2',null,'你好')

])



## 四. 什么是虚拟DOM？虚拟DOM在React中起到什么作用？

* 虚拟DOM  虚拟DOM本质上是js对象 当我们修改对象中某些值或属性时, 内部会有一个diff算法,匹配哪些内容我们经过修改,他就只会更新我们修改的内容,其他部分不会进行更新,有助于性能的提升
* 跨平台渲染 -> 虚拟DOM本质上是js对象 可以通过uni -app react-native flutter 等平台,让我们js代码转换为相对应的代码
* 声明式编程 ->命令式编程(定义变量,亲自操作DOM去修改值等) 声明式编程(只需要我们维护数据即可,然后将数据展示到模板上)



## 五. 分析脚手架创建的React项目目录结构，并且删除文件后自己编写代码

1.node_modules 存放第三方库的依赖

2.public

- 存放index(模板文件)等文件 

- favicon 网站页签图标

- PWA (了解即可)

- ![image-20230312005725557](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230312005725557.png)

- robots 希望会被爬虫发现或不发现 (了解即可)

  

3.src 存放源代码等

4.package-lock.json 存放依赖的真实版本,与缓存依赖等

5.package.json 存放各种依赖与启动等配置项

![image-20230312024812691](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20230312024812691.png)



## 六. 选做：寻找之前课程中的一些案例，尝试使用React来实现
