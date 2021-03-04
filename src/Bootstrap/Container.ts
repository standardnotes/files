import * as winston from 'winston'
import * as superagent from 'superagent'
import { Container } from 'inversify'

import { Env } from './Env'
import TYPES from './Types'

export class ContainerConfigLoader {
    async load(): Promise<Container> {
        const env: Env = new Env()
        env.load()

        const container = new Container()

        const logger = this.createLogger({env})
        container.bind<winston.Logger>(TYPES.Logger).toConstantValue(logger)

        container.bind<superagent.SuperAgentStatic>(TYPES.HTTPClient).toConstantValue(superagent)

        return container
    }

    createLogger({env}: {env: Env}) {
        return winston.createLogger({
            level: env.get('LOG_LEVEL') || 'info',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.json(),
            ),
            transports: [
                new winston.transports.Console({ level: env.get('LOG_LEVEL') || 'info' }),
            ],
          })
    }
}
