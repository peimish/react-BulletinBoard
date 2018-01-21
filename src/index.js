import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import request from 'superagent'
import { Button } from 'react-bootstrap';

// --------------------------------------------------------
// 掲示板アプリのClient側
// --------------------------------------------------------
// コメント入力フォームのコンポーネントを定義
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
    // コメントを投稿する
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
            <form>
                <div className="form-group">
                    <label htmlFor="name">名前：</label>
                    <input className="form-control" style={styles.inputName} id='name' type='text' value={this.state.name} onChange={e => this.nameChanged(e)} /><br />
                </div>
                <div className="form-group">
                    <label htmlFor="comment">コメント：</label>
                    <textarea id='comment' className="form-control"
                        style={styles.textarea}
                        maxLength="10000"
                        placeholder="コメントを入力してください"
                        value={this.state.body}
                        onChange={e => this.bodyChanged(e)}
                    >
                    </textarea>
                </div>
                <div className="form-group">
                    <div className="control-label">
                        <p style={styles.right}>
                            <Button onClick={e => this.post()}>投稿する</Button>
                        </p>
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
                <div className="panel panel-default">
                    <div className="panel-heading">コメントを入力する</div>
                    <div className="panel-body">
                        <BBSForm onPost={e => this.loadLogs()} />
                    </div>
                </div>
                <ul>{itemsHtml}</ul>
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
    },
    inputName: {
        width: 200
    },
    textarea: {
        minHeight: 100,
        maxHeight: 350,
        height: 100,
        width: '100%',
        padding: 10
    }
}

// DOMにメインコンポーネントを書き込む
ReactDOM.render(<BBSApp />, document.getElementById('root'))
