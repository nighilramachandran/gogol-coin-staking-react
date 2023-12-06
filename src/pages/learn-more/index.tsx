import React, { useEffect, useMemo } from "react"
import { Row, Col, Container, Table } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { CustomTableInfo } from "../../components/custom-table-info"
import { CustomText } from "../../components/custom-text"
import { secondarycolor } from "../../utils/constants/valiables"
import { useBreakpoints } from "../../utils/hooks"

import "./index.scss"

export const LearnMore: React.FC = () => {
  const {
    i18n: { language },
    t,
  } = useTranslation()
  const en = language === "en"

  const tables_content = useMemo(
    () => [
      {
        content: [
          [t("t11"), t("t12"), t("t13"), t("t14"), t("t15"), t("t16")],
          ["250,000 GOLC", "70,000 GOLC", "320,000 GOLC", "800,000 GOLC", "550,000 GOLC", "220%"],
          ["200,000 GOLC", "50,000 GOLC", "250,000 GOLC", "625,000 GOLC", "425,000 GOLC", "212.5%"],
          ["150,000 GOLC", "35,000 GOLC", "185,000 GOLC", "462,500 GOLC", "312,500 GOLC", "209%"],
          ["100,000 GOLC", "15,000 GOLC", "115,000 GOLC", "287,500 GOLC", "187,500 GOLC", "187.5%"],
          ["50,000 GOLC", "7,500 GOLC", "57,500 GOLC", "143,750 GOLC", "93,750 GOLC", "187.5%"],
          ["25,000 GOLC", "3,500 GOLC", "28,500 GOLC", "71,250 GOLC", "46,500 GOLC", "181%"],
          ["10,000 GOLC", "1,000 GOLC", "11,000 GOLC", "27,500 GOLC", "17,500 GOLC", "175%"],
        ],
      },
      {
        title: t("t2"),
        content: [
          [t("t21"), t("t22"), t("t23"), t("t24"), t("t25"), t("t26")],

          ["250,000 GOLC", "320,000 GOLC", "480,000 GOLC", "150%", "12.5%", "2.88%"],
          ["200,000 GOLC", "250,000 GOLC", "375,000 GOLC", "150%", "12.5%", "2.88%"],
          ["150,000 GOLC", "185,000 GOLC", "277,500 GOLC", "150%", "12.5%", "2.88%"],
          ["100,000 GOLC", "115,000 GOLC", "172,500 GOLC", "150%", "12.5%", "2.88%"],
          ["50,000 GOLC", "57,500 GOLC", "82,250 GOLC", "150%", "12.5%", "2.88%"],
          ["25,000 GOLC", "28,500 GOLC", "42,750 GOLC", "150%", "12.5%", "2.88%"],
          ["10,000 GOLC", "11,000 GOLC", "16,500 GOLC", "150%", "12.5%", "2.88%"],
        ],
      },
      {
        title: t("t3"),
        content: [
          [t("t31"), t("t32"), t("t33"), t("t34"), t("t35"), t("t36")],
          ["320,000 GOLC", "480,000 GOLC", "2.88%", "9,230.76 GOLC", "2,769.22 GOLC", "6,461.54 GOLC"],
          ["250,000 GOLC", "375,000 GOLC", "2.88%", "7,211.53 GOLC", "2,163.45 GOLC", "5,048.08 GOLC"],
          ["185,000 GOLC", "277,500 GOLC", "2.88%", "5,336.53 GOLC", "1,600.95 GOLC", "3,735.58 GOLC"],
          ["115,000 GOLC", "172,500 GOLC", "2.88%", "3,317.30 GOLC", "955.19 GOLC", "2,322.11 GOLC"],
          ["57,500 GOLC", "68,250 GOLC", "2.88%", "1,658.65 GOLC", "497.59 GOLC", "1,161.06 GOLC"],
          ["28,500 GOLC", "42,750 GOLC", "2.88%", "822.11 GOLC", "246.63 GOLC", "575.48 GOLC"],
          ["11,000 GOLC", "16,500 GOLC", "2.88%", "317.30 GOLC", "95.19 GOLC", "222.11 GOLC"],
        ],
      },
      {
        title: t("t4"),
        content: [
          [t("t41"), t("t42"), t("t43"), t("t44"), t("t45"), t("t46")],
          ["320,000 GOLC", "480,000 GOLC", "12.5%", "40,000 GOLC", "10.000 GOLC", "30,000 GOLC"],
          ["250,000 GOLC", "375,000 GOLC", "12.5%", "31,250 GOLC", "7,812.50 GOLC", "23,437.50 GOLC"],
          ["185,000 GOLC", "277,500 GOLC", "12.5%", "23,125 GOLC", "5,781.25 GOLC", "17,343.75 GOLC"],
          ["115,000 GOLC", "172,500 GOLC", "12.5%", "14.375 GOLC", "3,593.75 GOLC", "10,781.25 GOLC"],
          ["57,500 GOLC", "68,250 GOLC", "12.5%", "7,187.5 GOLC", "1,796.87 GOLC", "5,390.63 GOLC"],
          ["28,500 GOLC", "42,750 GOLC", "12.5%", "3,562.50 GOLC", "890.62 GOLC", "2,671.88 GOLC"],
          ["11,000 GOLC", "16,500 GOLC", "12.5%", "1,375 GOLC", "343.75 GOLC", "1,031.25 GOLC"],
        ],
      },
    ],
    [language]
  )
  useEffect(() => {}, [tables_content])

  return (
    <div className="learn-more" dir="ltr">
      <Container>
        <Row className="justify-content-center g-0" data-testid="row-learn-more">
          <Col xs={10}>
            <div className="learn-more-content">
              <CustomText data-testid="title-learn-more" fs={1} color="white">
                {t("what_is_staking")}
              </CustomText>

              <CustomText tag="h5">
                <CustomText en={en} color="white" dangerouslySetInnerHTML={{ __html: t("buy_digital_currency") }}></CustomText>
                <CustomText en={en} color="gold">
                  {t("time")}
                </CustomText>
              </CustomText>

              <CustomText color="white">
                <CustomText dangerouslySetInnerHTML={{ __html: t("one_of_the_most") }}></CustomText>
                <CustomText dangerouslySetInnerHTML={{ __html: t("the_main_goal") }}></CustomText>
              </CustomText>

              <CustomText tag="h5">
                <CustomText en={en} color="white" dangerouslySetInnerHTML={{ __html: t("features0") }}></CustomText>
                <CustomText en={en} color="gold">
                  {t("features")}
                </CustomText>
              </CustomText>

              <CustomText color="white">
                <ul dir={en ? "ltr" : "rtl"}>
                  <li>
                    <CustomText fs={4} data-testid="Achieving-150%">
                      {t("feature1")}
                    </CustomText>
                  </li>
                  <li>
                    <CustomText fs={4} dangerouslySetInnerHTML={{ __html: t("feature2") }}></CustomText>
                  </li>
                </ul>
              </CustomText>
              <CustomText en={en} tag="h5" color="white" dangerouslySetInnerHTML={{ __html: t("details") }}></CustomText>

              {tables_content.map((tbl, ind) => (
                <TableComponent content={tbl.content} title={tbl.title} key={ind} />
              ))}
              <CustomText data-testid="Basic-Instructions" tag="h5" color="gold" style={{ margin: "20px 0" }}>
                {t("instructions")}
              </CustomText>
              <CustomText fs={4} color="white">
                <ul dir={en ? "ltr" : "rtl"}>
                  <li dangerouslySetInnerHTML={{ __html: t("instruction1") }}></li>
                  <li dangerouslySetInnerHTML={{ __html: t("instruction2") }}></li>
                  <li
                    data-testid="stored-30days"
                    style={{ color: "#fff !important" }}
                    dangerouslySetInnerHTML={{ __html: t("instruction3") }}
                  ></li>
                  <li data-testid="30%-of-the-profits" dangerouslySetInnerHTML={{ __html: t("instruction4") }}></li>
                  <li dangerouslySetInnerHTML={{ __html: t("instruction5") }}></li>
                  <li dangerouslySetInnerHTML={{ __html: t("instruction6") }}></li>
                  <li dangerouslySetInnerHTML={{ __html: t("instruction7") }}></li>
                </ul>
              </CustomText>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export const TableComponent: React.FC<{ content: string[][]; title?: string }> = ({ content, title }) => {
  const { lg } = useBreakpoints()

  useEffect(() => {
    content = content.reverse()
  }, [content])

  return (
    <>
      {title && (
        <CustomText tag="h4" color="white" style={{ margin: "5px 0" }}>
          {title}
        </CustomText>
      )}

      <CustomTableInfo header={content[0]} content={content.slice(1, content.length)}></CustomTableInfo>
    </>
  )
}
