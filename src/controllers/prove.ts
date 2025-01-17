import { Body, Controller, Ctx, Get, Params, Post } from 'amala'
import { Context } from 'koa'
import { Job, JobModel } from '@/models/Job'
import { notFound } from '@hapi/boom'
import Inputs from '@/validators/Inputs'
import JobStatus from '@/models/JobStatus'
import ProofResultParams from '@/validators/ProofResultParam'

@Controller('/prove')
export default class ProveController {
  @Post('/')
  async proof(@Body({ required: true }) input: Inputs) {
    const job = await JobModel.create({ input })
    job.input = undefined
    const result: { job: Job; position?: number } = { job }
    if (job.status === JobStatus.scheduled)
      result.position = await JobModel.countDocuments({
        status: JobStatus.scheduled,
        createdAt: { $lt: job.createdAt },
      })

    return result
  }
  @Get('/:id')
  async status(@Ctx() ctx: Context, @Params() { id }: ProofResultParams) {
    const job = await JobModel.findById(id)
    if (!job) return ctx.throw(notFound())

    job.input = undefined
    const result: { job: Job; position?: number } = { job }
    if (job.status === JobStatus.scheduled)
      result.position = await JobModel.countDocuments({
        status: JobStatus.scheduled,
        createdAt: { $lt: job.createdAt },
      })

    return result
  }
}
