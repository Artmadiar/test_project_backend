import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import models from '../../models'
import { NotFound, InvalidRequest } from '../../lib/errors'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      throw new InvalidRequest(validation)
    }

    const user = await models.User.findOne({
      where: { id: req.params.id }
    })

    if (!user) {
      throw new NotFound('User not found')
    }

    await user.destroy()
    
    return res.sendStatus(204)
  } catch (error) {
    return next(error)
  }
}
