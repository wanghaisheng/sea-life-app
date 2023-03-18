import { useEffect } from "react";
import tippy, { Instance } from "tippy.js";
import { ISpecies } from "../../../types/Species";

export default function SpeciesTitleTooltips(props: { species: ISpecies }) {
  useEffect(() => {
    const tippyOptions: any = {
      allowHTML: true,
      arrow: true,
    };

    let tippyInstance1: Instance;
    let tippyInstance2: Instance;

    if (props.species.common_names.fr.length > 1) {
      tippyInstance1 = tippy("#commonNamesFr", {
        ...tippyOptions,
        content: props.species.common_names.fr.join("<br/>"),
      })[0];
    }
    if (props.species.common_names.en.length > 1) {
      tippyInstance2 = tippy("#commonNamesEn", {
        ...tippyOptions,
        content: props.species.common_names.en.join("<br/>"),
      })[0];
    }

    return () => {
      if (tippyInstance1) {
        tippyInstance1.unmount();
      }
      if (tippyInstance2) {
        tippyInstance2.unmount();
      }
    };
  }, []);

  return <></>;
}
