import helmet from "helmet"

export default () => {
  return helmet({
    contentSecurityPolicy: false,
    expectCt: process.env.EXPECT_CT,
    referrerPolicy: process.env.REFERER_POLICY,
  })
}
