import { CommentRepository } from './Comment';

describe('CommentRepository tests', () => {
  it('Comments for post 13', async () => {
    const comments = await CommentRepository.fetchComments('13');
    expect(comments.length)
      .toBe(2);
  });
});
