import styled from "styled-components";
import { ISpecies } from "../../types/Species";

// svg
import FrFlagSvg from "../../public/icons/flags/FR.svg";
import GbFlagSvg from "../../public/icons/flags/GB.svg";

export default function SpeciesTitle(props: { species: ISpecies }) {
  return (
    <Style>
      {props.species.common_name.fr && (
        <div className="title">
          <div>
            <FrFlagSvg width="16px" />
          </div>
          <span className="ml-2">{props.species.common_name.fr}</span>
        </div>
      )}
      {props.species.common_name.en && (
        <div className="title">
          <div>
            <GbFlagSvg width="16px" />
          </div>
          <span className="ml-2">{props.species.common_name.en}</span>
        </div>
      )}
      <div className="scientific-name">{props.species.scientific_name}</div>
    </Style>
  );
}

// Style
const Style = styled.div`
  padding: 0px 6px;
  margin-bottom: 16px;
  margin-top: 12px;

  .title {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;

    > span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .scientific-name {
    font-size: 16px;
    font-style: italic;
    color: var(--text-color-2);
  }
`;
