import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import BottomNavigation from "../../components/commons/BottomNavigation";
import Header from "../../components/commons/Header";
import SeaTurtleImage from "../../public/img/categories/sea-turtle.png";
import PosidoniaImage from "../../public/img/categories/posidonia.png";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";
import styled from "styled-components";
import { ISpecies } from "../../types/Species";
import { getAllSpecies } from "../../utils/firestore/species.firestore";

const Explore: NextPage<{
  count: {
    fauna: number;
    flora: number;
  };
}> = ({ count }) => {
  return (
    <>
      <Header title="Explore" />
      <div className="main-container">
        <Style>
          <m.div
            whileTap={{
              scale: tapAnimationDuration,
              transition: { duration: 0.1, ease: "easeInOut" },
            }}
          >
            {/* Categories */}
            <Link href="explore/fauna">
              <a>
                <div className="category fauna">
                  <div className="content">
                    <div className="title">Faune</div>
                    <div className="subtitle">{count?.fauna} espèces</div>
                  </div>
                  <div className="align-self-center text-center">
                    <Image
                      src={SeaTurtleImage}
                      alt="Sea Turtle"
                      width={200}
                      height={90}
                    />
                  </div>
                </div>
              </a>
            </Link>
          </m.div>

          <m.div
            whileTap={{
              scale: tapAnimationDuration,
              transition: { duration: 0.1, ease: "easeInOut" },
            }}
          >
            <Link href="explore/flora">
              <a>
                <div className="category flora">
                  <div className="content">
                    <div className="title">Flore</div>
                    <div className="subtitle">{count?.flora} espèces</div>
                  </div>
                  <div className="align-self-center text-center">
                    <Image
                      src={PosidoniaImage}
                      alt="Posidonia"
                      width={200}
                      height={120}
                    />
                  </div>
                </div>
              </a>
            </Link>
          </m.div>
        </Style>
      </div>
      <BottomNavigation />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const fauna_count = (await getAllSpecies("animalia")).length;
  const flora_count = (await getAllSpecies("plantae")).length;

  return { props: { count: {
    fauna: fauna_count,
    flora: flora_count
  } }, revalidate: 120 };
};

export default Explore;

// Style
const Style = styled.div`
  width: 100%;

  .category {
    &.fauna {
      background: linear-gradient(290.64deg, #e9eef1 0%, #b3d3e6 98.25%);
      color: var(--blue);
    }
    &.flora {
      background: linear-gradient(290.64deg, #f3f3f3 0%, #d9edd4 98.25%);
      color: var(--green);
    }

    border-radius: var(--border-radius);
    width: 100%;
    height: 150px;
    display: flex;
    align-items: flex-end;
    margin-bottom: 1rem;

    .content {
      padding: 22px;
      min-width: 150px;

      .title {
        font-size: 32px;
        font-weight: bold;
      }
    }
  }
`;
