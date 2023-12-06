import React, { useEffect, useMemo } from "react"
import { Row, Col, Container } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { CustomText } from "../../components/custom-text"
import { secondarycolor } from "../../utils/constants/valiables"
import { useBreakpoints } from "../../utils/hooks"

import "./index.scss"

export const TermsAndConditions: React.FC = () => {
  const {
    i18n: { language },
    t,
  } = useTranslation()
  const en = language === "en"

  return (
    <div className="terms-and-conditions" dir="ltr" data-testid="terms">
      <Container>
        <Row className="justify-content-center g-0" data-testid="Row-terms">
          <Col xs={10} data-testid="Col-terms">
            <div className="terms-and-conditions-content">
              {/* <CustomText en tag="h2" color="white" style={{ textDecoration: "underline", textDecorationColor: secondarycolor }}>
                Staking GogolCoin
              </CustomText> */}

              <CustomText data-testid="title-terms" en={en} style={{ textAlign: "center" }} tag="h4" color="white">
                {t("Terms")}
              </CustomText>

              <CustomText en={en} color="gray">
                <ul>
                  <CustomText en={en} color="white" dangerouslySetInnerHTML={{ __html: t("new_smart") }}></CustomText>
                </ul>
                <ul dir={en ? "ltr" : "rtl"}>
                  <li style={{}}>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("laun_ching") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("golcoin1")}
                      </CustomText>
                      <CustomText en={en}>{t("with_a_logo")}</CustomText>
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("offering") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("smartconttract")}
                      </CustomText>
                      <CustomText en={en}>{t("qualifies_the_currency")}</CustomText>
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("Introducing") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("smart_contract")}
                      </CustomText>
                      <CustomText en={en}>{t("with")}</CustomText>
                      <CustomText en={en} color="white">
                        {t("gol_network")}
                      </CustomText>
                      {/* <CustomText en={en}>{t("supply")}</CustomText> */}
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("web_page") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("technology")}
                      </CustomText>
                      <CustomText en={en}>{t("real_projects")}</CustomText>
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("activation") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("ecosystem")}
                      </CustomText>

                      <CustomText en={en}>{t("the_concepts")}</CustomText>
                      <CustomText en={en} color="white">
                        {t("ecosystem")}
                      </CustomText>
                      <CustomText en={en}>{t("digital_currency")}</CustomText>
                    </CustomText>
                  </li>
                  {/* <li>
                    <CustomText>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("web_page") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("technology")}
                      </CustomText>
                      <CustomText en={en}>{t("real_projects")}</CustomText>
                    </CustomText>
                  </li> */}
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("announcement") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("tokenomix")}
                      </CustomText>
                      <CustomText en={en}>{t("transparent")}</CustomText>
                    </CustomText>
                  </li>
                </ul>
                <ul dir={en ? "ltr" : "rtl"}>
                  <CustomText
                    data-testid="transfer-balances-terms"
                    en={en}
                    color="gold"
                    fs={3}
                    dangerouslySetInnerHTML={{ __html: t("choices_presented") }}
                  ></CustomText>
                </ul>
                <ul dir={en ? "ltr" : "rtl"}>
                  <CustomText fs={4} color="white" data-testid="new-contract-terms">
                    <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("suggestions") }}></CustomText>
                    <CustomText en={en} color="white">
                      {t("smart_contract1")}
                    </CustomText>
                    <CustomText en={en}>{t("follows")}</CustomText>
                  </CustomText>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("Transfer_currency") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("stakingg")}
                      </CustomText>
                      <CustomText en={en}>{t("process")}</CustomText>
                      <CustomText en={en} color="white">
                        {t("golstaking_platform")}
                      </CustomText>

                      <CustomText en={en}>{t("exchange")}</CustomText>
                      <CustomText en={en} color="white">
                        {t("gogolcoin")}
                      </CustomText>
                      <CustomText en={en}>{t("aand")}</CustomText>
                      <CustomText en={en} color="white">
                        {t("golcoin")}
                      </CustomText>
                      <CustomText en={en}>{t("will_be")}</CustomText>
                    </CustomText>
                  </li>
                </ul>

                <ul dir={en ? "ltr" : "rtl"}>
                  <CustomText data-testid="1golc=1golc" en={en} color="white" dangerouslySetInnerHTML={{ __html: t("Golc") }}></CustomText>
                </ul>
                <ul dir={en ? "ltr" : "rtl"}>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("adopting_the_code") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("September")}
                      </CustomText>
                      <CustomText en={en}>{t("last_day")}</CustomText>
                      <CustomText en={en} color="white">
                        {t("st1")}
                      </CustomText>
                      <CustomText en={en}>{t("requests")}</CustomText>
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("the_scheduled") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("st2")}
                      </CustomText>
                      <CustomText en={en}>{t("platform111")}</CustomText>
                      <CustomText en={en} color="white">
                        {t("october")}
                      </CustomText>
                    </CustomText>
                  </li>{" "}
                  <li>
                    <CustomText>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("Immediately") }}></CustomText>
                      {/* <CustomText en={en} color="white">
                        {t("4%")}
                      </CustomText>
                      <CustomText> {t("monthly")}</CustomText> */}
                    </CustomText>
                  </li>
                </ul>
                <ul dir={en ? "ltr" : "rtl"}>
                  <CustomText fs={4} en={en} color="white" dangerouslySetInnerHTML={{ __html: t("one") }}></CustomText>
                </ul>
                <ul dir={en ? "ltr" : "rtl"} className="important">
                  {/* <li>
                    <CustomText>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("cal1") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("gol100")}
                      </CustomText>
                      <CustomText> {t("cal2")}</CustomText>
                    </CustomText>
                  </li> */}
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("cal3") }}></CustomText>
                      <CustomText data-testid="percentage-of-4%" en={en} color="white">
                        {t("4%")}
                      </CustomText>
                      <CustomText en={en}> {t("cal4")}</CustomText>
                      <CustomText en={en} color="white">
                        {t("gol2")}
                      </CustomText>
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("cal3") }}></CustomText>
                      <CustomText data-testid="percentage-of-0.05%" en={en} color="white">
                        {"0.05% "}
                      </CustomText>
                      <CustomText en={en}> {t("over_all")}</CustomText>
                      <CustomText en={en} color="white">
                        {"GOLC 10,000 "}
                      </CustomText>
                      <CustomText en={en}> {t("above_than")}</CustomText>
                      <CustomText en={en} color="white">
                        {"100,000 GOLC."}
                      </CustomText>
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("cal3") }}></CustomText>
                      <CustomText data-testid="percentage-of-5%" en={en} color="white">
                        {t("5%")}
                      </CustomText>
                      <CustomText en={en}> {t("larger_than")}</CustomText>
                      <CustomText en={en} color="white">
                        {"GOLC 300,000."}
                      </CustomText>
                    </CustomText>
                  </li>
                </ul>
                <ul>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("To_complete_the_transfer") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("gogolcoin1")}
                      </CustomText>
                      <CustomText> {t("to_email")}</CustomText>
                      <CustomText data-testid="email-Sheikhferas" en={en} color="white">
                        {t("Sheikhferas")}
                      </CustomText>

                      <CustomText en={en}>{t("at_the_platforms")}</CustomText>
                      <CustomText en={en} color="white">
                        {t("LATOKEN")}
                      </CustomText>
                      <CustomText en={en}>{t("platform11")}</CustomText>
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("Send_an_email") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("ferasss")}
                      </CustomText>
                      <CustomText en={en}>{t("attached")}</CustomText>
                    </CustomText>
                  </li>
                </ul>
                <ol type={"I"}>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("Screenshot") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("do_latoken")}
                      </CustomText>
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("Send_the_investor") }}></CustomText>
                      <CustomText data-testid="TX-id" en={en} color="white">
                        {t("TX")}
                      </CustomText>
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("Sending_the_email") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("similakton")}
                      </CustomText>
                      <CustomText en={en}>{t("mail")}</CustomText>
                      <CustomText en={en} color="white">
                        {t("one_STAKING")}
                      </CustomText>
                      <CustomText en={en}>{t("platform_thee")}</CustomText>
                      <CustomText en={en} color="white">
                        {t("golstaking")}
                      </CustomText>

                      <CustomText en={en}>{t("mailplatform")}</CustomText>
                      <CustomText en={en} color="white">
                        {t("lakton")}
                      </CustomText>
                      <CustomText en={en}>{t("platform")}</CustomText>
                    </CustomText>
                  </li>
                </ol>
                <ul>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("After_sending") }}></CustomText>
                      <CustomText en={en} color="white">
                        {t("golstaking")}
                      </CustomText>
                      <CustomText en={en}>{t("platform_knowing")}</CustomText>
                      <CustomText en={en} color="white">
                        {t("golstaking")}
                      </CustomText>
                      <CustomText en={en}>{t("activated")}</CustomText>
                      <CustomText data-testid="48hours" en={en} color="white">
                        {t("48 ")}
                      </CustomText>
                      <CustomText en={en}>{t("hours")}</CustomText>
                    </CustomText>
                  </li>
                  <li>
                    <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("Percentages_of_commissions") }}></CustomText>
                  </li>
                </ul>
                <ol type={"I"}>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("If_the_currency_rate") }}></CustomText>
                      <CustomText data-testid="rate-less-$50" en={en} color="white">
                        {t("$50")}
                      </CustomText>
                      <CustomText en={en}>{t("percentage")}</CustomText>
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("If_the_price") }}></CustomText>
                      <CustomText data-testid="rate-between-$50" en={en} color="white">
                        {t("50 ")}
                      </CustomText>
                      <CustomText en={en}>{t("and")}</CustomText>
                      <CustomText data-testid="rate-between-$100" en={en} color="white">
                        {t("100 ")}
                      </CustomText>
                      <CustomText en={en}>{t("the_percentage")}</CustomText>
                      <CustomText data-testid="percentage-of-2.5%" en={en} color="white">
                        {t("2.5% ")}
                      </CustomText>
                      <CustomText en={en}>{t("investor_of")}</CustomText>
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("the_currency") }}></CustomText>
                      <CustomText data-testid="ranges-between-$100-$200" en={en} color="white">
                        {"$100"}
                      </CustomText>
                      <CustomText en={en}>{t("and")}</CustomText>
                      <CustomText en={en} color="white">
                        {t("$200")}
                      </CustomText>
                      <CustomText en={en}>{t("on_the_platforms")}</CustomText>
                      <CustomText data-testid="5%-of-total-withdrawn" en={en} color="white">
                        {t("5%")}
                      </CustomText>
                      <CustomText en={en}>{t("investor_of")}</CustomText>
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("coin_exceeds") }}></CustomText>
                      <CustomText data-testid="coin-exceeds-$200" en={en} color="white">
                        {t("$200")}
                      </CustomText>
                      <CustomText en={en}>{t("on_the_platforms")}</CustomText>
                      <CustomText data-testid="20%-of-total-withdrawn" en={en} color="white">
                        {t("20%")}
                      </CustomText>
                      <CustomText en={en}>{t("investor_of")}</CustomText>
                    </CustomText>
                  </li>
                </ol>
                <ul>
                  <CustomText en={en} color="white" dangerouslySetInnerHTML={{ __html: t("consequences") }}></CustomText>
                </ul>
                <ul dir={en ? "ltr" : "rtl"}>
                  <li>
                    <CustomText fs={4}>
                      <CustomText en={en} dangerouslySetInnerHTML={{ __html: t("stored") }}></CustomText>
                      <CustomText data-testid="stored-in-GOLSTAKING" en={en} color="white">
                        {t("golstaking")}
                      </CustomText>
                      <CustomText en={en}>{t("platform_transferred")}</CustomText>
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4} en={en} dangerouslySetInnerHTML={{ __html: t("complete_dropping") }}></CustomText>
                  </li>
                  <li>
                    <CustomText fs={4} en={en} dangerouslySetInnerHTML={{ __html: t("investor") }}></CustomText>
                  </li>
                  <li>
                    <CustomText fs={4} en={en} dangerouslySetInnerHTML={{ __html: t("STAKING") }}></CustomText>
                  </li>
                  <li>
                    <CustomText fs={4} en={en} dangerouslySetInnerHTML={{ __html: t("people") }}></CustomText>
                  </li>
                </ul>
              </CustomText>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

const TableComponent: React.FC<{ content: string[][]; title?: string }> = ({ content, title }) => {
  const { lg } = useBreakpoints()

  useEffect(() => {
    content = content.reverse()
  }, [content])

  return (
    <>
      {title && (
        <CustomText tag="h3" color="white" style={{ margin: "40px 0", textAlign: "center" }}>
          {title}
        </CustomText>
      )}
      <div className=" c-card">
        <Container fluid>
          <Row className="justify-content-center g-3">
            {[...Array(6)].map((el, ind) => (
              <Col xs={12} lg={2} className="table-col" key={ind}>
                {ind !== 0 && lg && <div className="divider" />}
                <div className="table-col-content">
                  {[...Array(8)].map((e, j) => {
                    return (
                      <CustomText
                        // style={{ height: j !== 0 ? "" : "200px" }}
                        color={j !== 0 ? "gray" : "white"}
                        className="table-cell-content"
                        fs={3}
                        key={ind.toString() + j.toString()}
                      >
                        {content[j][5 - ind]}
                      </CustomText>
                    )
                  })}
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </>
  )
}
