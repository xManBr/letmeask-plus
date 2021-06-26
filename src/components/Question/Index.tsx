import { ReactNode } from 'react';
import './styles.scss';
import cx from 'classnames';

type QuestionPropos = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighLighted?: boolean;
}

export function Question({
  content,
  author,
  children,
  isAnswered = false,
  isHighLighted = false,
}: QuestionPropos) {
  return (
    <div className={
      cx(
        'question',
        { answered: isAnswered },
        { highLighted: isHighLighted && !isAnswered  }
      )
    }>
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  )

}