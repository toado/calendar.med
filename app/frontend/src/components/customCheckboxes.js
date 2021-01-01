import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

export const CareerPlanningCheckbox = withStyles({
    root: {
      color: "#d7e1ee",
      "&$checked": {
        color: "#d7e1ee"
      }
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);

export const ClinicalShadowingCheckbox = withStyles({
    root: {
      color: "#f9f1a8",
      "&$checked": {
        color: "#f9f1a8"
      }
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);

export const ClinicalSkillsCheckbox = withStyles({
    root: {
      color: "#f1a4bd",
      "&$checked": {
        color: "#f1a4bd"
      }
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);

export const DiscoveryLearningCheckbox = withStyles({
    root: {
      color: "#32e7d6",
      "&$checked": {
        color: "#32e7d6"
      }
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);

export const ExamCheckbox = withStyles({
    root: {
      color: "#f07070",
      "&$checked": {
        color: "#f07070"
      }
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);

export const LabsCheckbox = withStyles({
    root: {
      color: "#f9d39b",
      "&$checked": {
        color: "#f9d39b"
      }
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);

export const LearningCommunitiesCheckbox = withStyles({
    root: {
      color: "#d4a0dd",
      "&$checked": {
        color: "#d4a0dd"
      }
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);

export const OSCECheckbox = withStyles({
    root: {
      color: "#b5b5b5",
      "&$checked": {
        color: "#b5b5b5"
      }
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);

export const SelfDirectedLearningCheckbox = withStyles({
    root: {
      color: "#b1e7b3",
      "&$checked": {
        color: "#b1e7b3"
      }
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);

export const SmallGroupCheckbox = withStyles({
    root: {
      color: "#a884ff",
      "&$checked": {
        color: "#a884ff"
      }
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);

export const SpecialEventsCheckbox = withStyles({
    root: {
      color: "#f3b7ad",
      "&$checked": {
        color: "#f3b7ad"
      }
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);

export const TeamBasedLearningCheckbox = withStyles({
    root: {
      color: "#8798f4",
      "&$checked": {
        color: "#8798f4"
      }
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);

export const WholeClassCheckbox = withStyles({
    root: {
      color: "#97cef1",
      "&$checked": {
        color: "#97cef1"
      }
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);


// export const BlueCheckbox = withStyles({
//     root: {
//       color: blue[400],
//       "&$checked": {
//         color: blue[600]
//       }
//     },
//     checked: {}
// })((props) => <Checkbox color="default" {...props} />);
