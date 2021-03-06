import { postModel } from '../../models/forumPost'
import { filterPostInList } from './postFilter'
import { findUsersByIds } from '../user/users'

export const findPosts = (req, res) => {

  let cond = {}
  if( req.query.tags ) {
    cond = {'tags.code': { $in: req.query.tags }}
  }

  if( req.query.search ) {
    cond = Object.assign({}, cond, {'title': { $regex: req.query.search, $options: 'i' }})
  }

  postModel
    .find(cond)
    .sort({createdAt:-1})
    .exec()
    .then(async posts => {
      posts = JSON.parse(JSON.stringify(posts))

      // retrieve the users whom authored a post
      let users = await findUsersByIds(posts.map(f => f.createdBy))

      // add user info to each post then filter it to remove unwanted fields
      return res.status(200).json({
        posts: posts.map( post => filterPostInList(post, users.find( user => post.createdBy == user._id)))
      })
    })
    .catch(error => {
      res.status(500).json({
        error: error,
      })
    })
}
