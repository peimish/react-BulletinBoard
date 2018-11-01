import React, { Component } from 'react';
import request from 'superagent'
import { Button } from 'react-bootstrap';
import Dialog from 'react-bootstrap-dialog'

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
        // コメントの入力をチェック
        if (this.state.body == "") {
            this.dialog.showAlert('コメントが入力されていません')
            return
        }
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
                    <input
                        id='name'
                        className="form-control"
                        style={styles.inputName}
                        type='text'
                        placeholder="名無しさん"
                        value={this.state.name}
                        onChange={e => this.nameChanged(e)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="comment">コメント：</label>
                    <textarea
                        id='comment'
                        className="form-control"
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
                <Dialog ref={(el) => { this.dialog = el }} />
            </form>
        )
    }
}

// スタイルを定義
const styles = {
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

export default BBSForm;
