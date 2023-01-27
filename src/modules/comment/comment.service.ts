import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.type.js';
import { getObjectId } from '../../utils/common.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { MAX_COMMENT_COUNT, NUM_AFTER_DIGIT } from './comment.constant.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { SortEnum } from '../../types/sort.enum.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    await this.updateFilmRatingAndCommentCount(dto.filmId);
    return comment.populate(['userId']);
  }

  public async updateFilmRatingAndCommentCount(filmId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .aggregate([
        { $match: { filmId: getObjectId(filmId) } },
        { $group: { _id: '$filmId', commentCount: { '$sum': 1 }, totalRating: { $avg: '$commentRating' } } },
        { $project: { _id: 1, commentCount: 1, rating: { $round: [ '$totalRating', NUM_AFTER_DIGIT ] } } },
        { $lookup: {
          from: 'films',
          pipeline: [
            { $match: { _id: getObjectId(filmId) } },
          ],
          localField: 'rating',
          foreignField: 'rating',
          as: 'filmRating'
        }},
        { $unset: 'filmRating' },
        { $lookup: {
          from: 'films',
          pipeline: [
            { $match: { _id: getObjectId(filmId) } },
          ],
          localField: 'commentCount',
          foreignField: 'commentCount',
          as: 'count'
        }},
        { $unset: 'count' },
        { $merge: { into: 'films' } }
      ]).exec();
  }

  public async findByFilmId(filmId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({filmId})
      .sort({createdAt: SortEnum.Down})
      .limit(MAX_COMMENT_COUNT)
      .populate(['userId'])
      .exec();
  }

  public async deleteByFilmId(filmId: string): Promise<number | null> {
    const result = await this.commentModel
      .deleteMany({filmId})
      .exec();

    return result.deletedCount;
  }
}
