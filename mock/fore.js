export default [
  {
    url: '/smsSendSummary',
    type: 'post',
    response: config => {
      return {
        code: 0,
        msg: 'success',
        data: [['2020-01-01', 47], ['2020-01-02', 30], ['2020-01-03', 99]]
      }
    }
  }
]
