import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import request from 'superagent'
import { Button } from 'react-bootstrap';
import BBSForm from './BBSForm.js';

// --------------------------------------------------------
// 掲示板アプリのClient側
// --------------------------------------------------------
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
        let itemsHtml = this.state.items.map(e => (
            <div key={e._id}>
                {e.name}
                < div className="panel panel-default" >
                    <div className="panel-body">{e.body}</div>
                </div >
            </div >
        ))
        // TODO: コメント未入力時のハンドリング
        if (this.state.items.map.length == 0) {
            console.log(this.state.items.length)
            itemsHtml = "まだコメントはありません"
        }
        return (
            <div className="container">
                <h2>掲示板アプリ</h2>
                <div className="page-header">
                    <h4>コメント</h4>
                </div>
                {itemsHtml}
                <div className="panel panel-default">
                    <div className="panel-heading">コメントを入力する</div>
                    <div className="panel-body">
                        <BBSForm onPost={e => this.loadLogs()} />
                    </div>
                </div>
            </div>
        )
    }
}

export default BBSApp;
