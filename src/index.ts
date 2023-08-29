import {app, settings} from "./setting";
import {runDb} from "./db/db";

const port = settings.PORT

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`)
    })
}
startApp()