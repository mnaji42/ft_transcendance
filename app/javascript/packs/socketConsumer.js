import { createConsumer } from '@rails/actioncable'

const consumer = createConsumer()
window.consumer = consumer // aid debugging

export default consumer
