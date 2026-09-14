const errorHandler = (err, req, res, next) => {
  if (err?.code === '400') {
    return res.status(Number(err?.code)).json({
      code: err?.code,
      status: 'BAD_REQUEST',
      errors: err?.errors
    })
  }
  if (err?.code === '401') {
    return res.status(Number(err?.code)).json({
      code: err?.code,
      status: 'UNAUTHORIZED',
      errors: err?.errors
    })
  }
  if (err?.code === '403') {
    return res.status(Number(err?.code)).json({
      code: err?.code,
      status: 'FORBIDDEN',
      errors: err?.errors
    })
  }
  if (err?.code === '404') {
    return res.status(Number(err?.code)).json({
      code: err?.code,
      status: 'NOT_FOUND',
      errors: err?.errors
    })
  }
  if (err?.code === '500') {
    return res.status(Number(err?.code)).json({
      code: err?.code,
      status: 'INTERNAL_SERVER_ERROR',
      errors: err?.errors
    })
  }
  if (err?.name === 'SequelizeValidationError') {
    const errorMap = {}

    err?.errors?.forEach((e, i) => {
      let path = e?.path || `unknown${i + 1}`
      errorMap[path] = e?.message
    })

    return res.status(400).json({
      code: '400',
      status: 'BAD_REQUEST',
      errors: errorMap
    })
  }
  if (err?.name === 'SequelizeUniqueConstraintError') {
    const errorMap = {}

    err?.errors?.forEach((e, i) => {
      let path = e?.path || `unknown${i + 1}`
      errorMap[path] = e?.message
    })

    return res.status(400).json({
      code: '400',
      status: 'BAD_REQUEST',
      errors: errorMap
    })
  }
  if (err?.name === 'SequelizeForeignKeyConstraintError') {

    return res.status(400).json({
      code: '400',
      status: 'BAD_REQUEST',
      errors: {
        messages: ['foreign key not found']
      }
    })
  }

  console.log(err)
  return res.status(500).json({
    code: '500',
    status: 'INTERNAL_SERVER_ERROR'
  })
}

module.exports = { errorHandler }