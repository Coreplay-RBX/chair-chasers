import { Component, BaseComponent } from "@flamework/components";

import { PlayerGui } from "shared/utilities/client";
import { commaFormat } from "shared/utilities/helpers";
import type { DataLinked } from "client/hooks";
import type { DataKey, DataValue } from "shared/data-models/generic";

interface Attributes {
  readonly DataKey: DataKey;
}

@Component({
  tag: "DataLinkedText",
  ancestorWhitelist: [ PlayerGui ]
})
export class DataLinkedText extends BaseComponent<Attributes, TextLabel> implements DataLinked {
  public onDataUpdate(key: DataKey, value: DataValue): void {
    if (key !== this.attributes.DataKey) return;

    switch (key) {
      case "notes":
        this.instance.Text = commaFormat(<number>value);
        break;
    }
  }
}
