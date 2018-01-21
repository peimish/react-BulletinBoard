import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import request from 'superagent'
import { Button } from 'react-bootstrap';

// --------------------------------------------------------
// 掲示板アプリのClient側
// --------------------------------------------------------
// 書き込みフォームのコンポーネントを定義
class BBSForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            body: ''
        }
    }
    // テキストボックスの値が変化した時の処理
    nameChanged(e) {
        this.setState({ name: e.target.value })
    }
    bodyChanged(e) {
        this.setState({ body: e.target.value })
    }
    // Webサーバに対して書き込みを投稿する
    post(e) {
        request
            .get('/api/write')
            .query({
                name: this.state.name,
                body: this.state.body
            })
            .end((err, data) => {
                if (err) {
                    console.error(err)
                }
                this.setState({ body: '' })
                if (this.props.onPost) {
                    this.props.onPost()
                }
            })
    }
    render() {
        return (
            <form className="form-horizontal">
                <div className="form-group">
                    <label className="col-sm-2 control-label" htmlFor="name">名前</label>
                    <input id='name' type='text' value={this.state.name} onChange={e => this.nameChanged(e)} /><br />
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label" htmlFor="comment">コメント</label>
                    <input id='comment' type='text' placeholder='コメントを入力してください' value={this.state.body} size='60' onChange={e => this.bodyChanged(e)} /><br />
                </div>
                <div className="form-group">
                    <div className="col-sm-2 control-label">
                        <Button onClick={e => this.post()}>投稿</Button>
                    </div>
                </div>
            </form>
        )
    }
}

// メインコンポーネントを定義
class BBSApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: []
        }
    }
    // コンポーネントがマウントされたらログを読み込む
    componentWillMount() {
        this.loadLogs()
    }
    // APIにアクセスして掲示板のログ一覧を取得
    loadLogs() {
        request
            .get('/api/getItems')
            .end((err, data) => {
                if (err) {
                    console.error(err)
                    return
                }
                this.setState({ items: data.body.logs })
            })
    }
    render() {
        // 発言ログの一つずつを生成する
        const itemsHtml = this.state.items.map(e => (
            <li key={e._id}>{e.name} - {e.body}</li>
        ))
        return (
            <div className="container">
                <h2>掲示板アプリ</h2>
                <div className="panel panel-default margin-bottom-40">
                    <div className="panel-heading">コメントを入力する</div>
                    <div className="panel-body">
                        <BBSForm onPost={e => this.loadLogs()} />
                        <p style={styles.right}>
                            <Button onClick={e => this.loadLogs()}>再読込</Button>
                        </p>
                        <ul>{itemsHtml}</ul>
                    </div>
                </div>
            </div>
        )
    }
}

// スタイルを定義
const styles = {
    h1: {
        backgroundColor: 'MediumBlue',
        color: 'white',
        fontSize: 24,
        padding: 12
    },
    form: {
        padding: 12,
        border: '1px solid silver',
        backgroundColor: '#F0F0F0'
    },
    right: {
        textAlign: 'right'
    }
}

// DOMにメインコンポーネントを書き込む
ReactDOM.render(<BBSApp />, document.getElementById('root'))
