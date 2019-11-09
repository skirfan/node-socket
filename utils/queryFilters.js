// const debug = require('debug')('app:utils:query-filters')

/**
 * Construct sort object from query params
 *
 * @param {Array}  fields Array of valid fields
 * @param {String} sort   `sortBy, sortOrder`
 */
const constructSort = (fields, sort = ',1') => {
  const s = sort.split(',')
  if (s.length > 2) throw new Error(`Invalid sort parameters`)

  const o = parseInt(s[1])
  const order = o < 1 ? -1 : o > 1 ? 1 : o

  if (typeof s[0] === 'string') {
    const sortBy = s[0].trim()
    if (sortBy) {
      if (!fields.includes(sortBy))
        throw new Error(`Invalid field name - ${sortBy}`)
      return { [sortBy]: order }
    }
  }
  return { _id: order }
}

/**
 * Construct find object from query params
 *
 * @param {Array}  fields Array of valid fields
 * @param {String} search `searchFor, searchIn`
 */
const constructFind = (fields, search = ',') => {
  const s = search.split(',')
  if (s.length > 2) throw new Error(`Invalid search parameters`)

  if (typeof s[0] !== 'string') return {}
  const sFor = s[0].trim()
  if (!sFor) return {}

  if (typeof s[1] !== 'string') return {}
  const sIn = s[1].trim()
  if (!sIn)
    return {
      $text: {
        $search: sFor,
        $caseSensitive: false,
        $diacriticSensitive: false
      }
    }

  if (![...fields, 'meta'].includes(sIn))
    throw new Error(`Invalid field name - ${sIn}`)

  switch (sIn) {
    case 'gender':
      return { [sIn]: { $regex: `^${sFor}`, $options: 'i' } }

    case 'phone': {
      const n = parseInt(sFor)
      return { [sIn]: n > 0 ? n : 0 }
    }

    case 'meta': {
      const str = require('./metaPhone')(sFor)
      return {
        $or: [
          { meta: { $regex: `^${str}` } },
          { lastName: { $regex: `${sFor}`, $options: 'i' } },
          { firstName: { $regex: `${sFor}`, $options: 'i' } }
        ]
      }
    }

    default:
      return { [sIn]: { $regex: `${sFor}`, $options: 'i' } }
  }
}

/**
 * Construct select object from query params
 *
 * @param {String}  list Comma separated list of fields
 * @param {Boolean} excl Exclude: true/false
 */
const constructSelect = (list = '', excl = false) => {
  let output = []
  if (list.trim()) {
    if (typeof list === 'string') {
      list = list.trim().split(',')
      if (list) list.forEach(f => output.push((excl ? '-' : '') + f))
    }
  }
  return output
}

/**
 * Construct pagination parameters from query params
 *
 * @param {Array}  fields Array of valid fields
 * @param {String} page   `recordsPerPage, pageNumber`
 */
const constructPage = (fields, page = '0,0') => {
  const p = page.split(',')
  if (p.length !== 2) throw new Error(`Invalid pagination parameters`)

  const records = parseInt(p[0])
  const pageNum = parseInt(p[1])
  if (typeof records === 'number' && typeof pageNum === 'number') {
    if (records > 0 && pageNum > 0)
      return {
        limit: records,
        skip: records * (pageNum - 1)
      }
  }

  return { limit: null, skip: null }
}

/**
 *
 * @param {Object} query  req.query (url query params)
 * @param {Array}  fields array of valid fields
 */

const constructParams = (query, fields) => {
  const { exclude, include, page, search, sort } = query
  try {
    if (include && exclude)
      throw new Error("`include` and `exclude` can't be used together")
    return {
      select: [...constructSelect(include), ...constructSelect(exclude, true)],
      sort: constructSort(fields, sort),
      find: constructFind(fields, search),
      page: constructPage(fields, page)
    }
  } catch ({ message }) {
    return { error: message }
  }
}

module.exports = {
  constructSort,
  constructFind,
  constructSelect,
  constructParams
}
