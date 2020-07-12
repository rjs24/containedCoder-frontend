import * as React from 'react'


interface ArticleProps {
    articleTitle?: string;
    content?: string;
    author?: string;
    aces?: string;
    comments?: string
  }

  interface ArticleState {
}

export class ArticleTitle extends React.Component<ArticleProps, ArticleState> {
        render() {
            const{articleTitle, content, author, aces, comments} = this.props;
            return (
                <div className="Title" style={{border: 'solid 5px gray', width: 5}}>
                    <h1>{this.props.articleTitle}</h1>
                    <h2>By Richard Seacome</h2>
                </div>
            );
        }
}