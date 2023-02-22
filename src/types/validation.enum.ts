import { getCurrentYear } from '../utils/common.js';

export const FilmValidationEnum = {
  Name: {
    IsString: 'name is required',
    MinLength: {
      Value: 5,
      Message: 'Minimum name length must be more than 5',
    },
    MaxLength: {
      Value: 100,
      Message: 'Maximum name length must be 100',
    },
  },
  Description: {
    IsString: 'description is required',
    MinLength: {
      Value: 20,
      Message: 'Minimum description length must be more than 5',
    },
    MaxLength: {
      Value: 1024,
      Message: 'Maximum description length must be 100',
    },
  },
  Rating: {
    IsInt: 'rating must be an integer',
    Min: {
      Value: 0,
      Message: 'Rating cannot be less than 0',
    },
    Max: {
      Value: 0,
      Message: 'Rating after creation cannot be more than 0',
    },
  },
  Genre: {
    IsEnum: 'genre must be Comedy, Crime, Documentary, Drama, Horror, Family, Romance, Scifi or Thriller'
  },
  Released: {
    IsInt: 'released must be an integer',
    Min: {
      Value: 1895,
      Message: 'There were no films before 1895'
    },
    Max: {
      Value: getCurrentYear(),
      Message: 'Unfortunately we can\'t add movies from the future',
    },
  },
  RunTime: {
    IsInt: 'runTime must be an integer',
    Min: {
      Value: 1,
      Message: 'The film must be at least 1 minute long'
    },
    Max: {
      Value: 240,
      Message: 'Sorry, we can\'t post a movie longer than 4 hours',
    },
  },
  Director: {
    IsString: 'director is required',
    MinLength: {
      Value: 2,
      Message: 'Minimum name director length must be more than 2',
    },
    MaxLength: {
      Value: 50,
      Message: 'Maximum name director length must be 50',
    },
  },
  Starring: {
    IsArray: 'Field starring must be an string array'
  },
  PosterImage: {
    IsString: 'posterImage is required',
    MaxLength: {
      Value: 256,
      Message: 'Too long path for field posterImage',
    },
    Matches: {
      Value: /^[a-zA-Z0-9-_]*[a-z0-9]\.jpg$/,
      Message: 'The format only “.jpg”. File naming can only be in Latin letters and numbers and from special characters can only be “_–”',
    }
  },
  BackgroundImage: {
    IsString: 'backgroundImage is required',
    MaxLength: {
      Value: 256,
      Message: 'Too long path for field backgroundImage',
    },
    Matches: {
      Value: /^[a-zA-Z0-9-_]*[a-z0-9]\.jpg$/,
      Message: 'The format only “.jpg”. File naming can only be in Latin letters and numbers and from special characters can only be “_–”',
    }
  },
  BackgroundColor: {
    IsHexColor: 'backgroundColor is required and must be in hexadecimal'
  },
  PreviewVideoLink: {
    IsString: 'previewVideoLink is required',
    MaxLength: {
      Value: 256,
      Message: 'Too long path for field previewVideoLink',
    },
    Matches: {
      Value: /^[a-zA-Z0-9-_]*[a-z0-9]\.mp4$/,
      Message: 'The format only “.mp4. File naming can only be in Latin letters and numbers and from special characters can only be “_–”',
    }
  },
  VideoLink: {
    IsString: 'videoLink is required',
    MaxLength: {
      Value: 256,
      Message: 'Too long path for field videoLink',
    },
    Matches: {
      Value: /^[a-zA-Z0-9-_]*[a-z0-9]\.mp4$/,
      Message: 'The format only “.mp4. File naming can only be in Latin letters and numbers and from special characters can only be “_–”',
    }
  },
  PublishDate: {
    IsDateString: 'publishDate must be valid ISO date'
  }
} as const;

export const UserValidationEnum = {
  Username: {
    IsString: 'username is required',
    MinLengthValue: 1,
    MaxLengthValue: 15,
    LengthMessage: 'Min length is 1, max is 15'
  },
  Email: {
    IsEmail: 'email must be valid address'
  },
  Password: {
    IsString: 'password is required',
    MinLengthValue: 6,
    MaxLengthValue: 12,
    LengthMessage: 'Min length is 6, max is 12'
  },
  AvatarPath: {
    MaxLength: {
      Value: 256,
      Message: 'Too long path for field avatarPath',
    },
    Matches: {
      Value: /^[a-zA-Z0-9-_]*[a-z0-9]\.(jpg|png)$/,
      Message: 'The format may be“.jpg” or «.png». File naming can only be in Latin letters and numbers and from special characters can only be “_–”',
    }
  }
} as const;

export const CommentValidationEnum = {
  CommentText: {
    IsString: 'commentText is required',
    MinLengthValue: 5,
    MaxLengthValue: 1024,
    LengthMessage: 'Min length is 5, max is 1024'
  },
  FilmId: {
    IsMongoId: 'filmId field must be a valid id'
  },
  CommentRating: {
    IsInt: 'commentRating must be an integer',
    Min: {
      Value: 1,
      Message: 'Minimum value 1'
    },
    Max: {
      Value: 10,
      Message: 'Maximum value 1',
    },
  },
  commentDate: {
    IsDateString: 'commentDate must be valid ISO date'
  }
} as const;

export const WatchlistValidationEnum = {
  FilmId: {
    IsMongoId: 'filmId field must be a valid id'
  }
} as const;
