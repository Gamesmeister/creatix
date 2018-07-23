import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './IdeaStreamWebPart.module.scss';
import * as strings from 'IdeaStreamWebPartStrings';

import { IIdeaListItem } from "../../models";
import { IdeaService } from "../../services";
import * as moment from "moment";

export interface IIdeaStreamWebPartProps {
  description: string;
}

export default class IdeaStreamWebPart extends BaseClientSideWebPart<IIdeaStreamWebPartProps> {

  private _ideaStreamElement: HTMLElement; 
  private _rendered : boolean = false;

  private ideaService: IdeaService;

  protected onInit(): Promise<void> {
    
    this.ideaService = new IdeaService(
      this.context.pageContext.web.absoluteUrl, 
      this.context.spHttpClient
    );

    return Promise.resolve(); 
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.IdeaStream }">
        <div class="${styles.sortBar}">
          <ul>
            <li class="${styles.activeSort}">
              <a id="sortLatest" href>Latest</a>
            </li>
            <li>
              <a id="sortCommented" href="#">Commented</a>
            </li>
          </ul>
        </div>
        <div class="${ styles.container }">
          <div id="ideaStream"><div>
        </div>
      </div>`;

    this._setSortLinks();
      this._ideaStreamElement = document.getElementById("ideaStream");

      this._getIdeas();
  }

  private _setSortLinks(): void {
    document.getElementById("sortCommented")
      .addEventListener('click', () => {
        this._rendered = false;
        this._getIdeas("$orderby=Comments desc")
      })
  }

  private _getIdeas(sortOrder?: string): void {
    this.ideaService.getIdeas(sortOrder)
      .then((ideas: IIdeaListItem[]) => {
        this._renderIdeas(this._ideaStreamElement, ideas);
      });
  }

  private _getDate(selectedDate:string, dateFormat: string): string { 
    let m = moment(selectedDate);
    return m.format(dateFormat);
  }

  private _truncateText(value: string, maxLength: number): string {

    if (value.length > maxLength) {
      let terminator: number = value.indexOf(" ", maxLength);
      value = value.substr(0, terminator);
      value = value + "...";
    }
    return value;
}

  private _renderIdeas(element: HTMLElement, ideas: IIdeaListItem[]): void {
    element.innerHTML = '';
    if (! this._rendered){
      let ideaStream: string = "";
      if (ideas && ideas.length && ideas.length > 0){
        ideas.forEach((idea: IIdeaListItem) => {
          let url: string = "";
          if (idea.IdeaImage) {
            url = idea.IdeaImage["Url"];
          }
          let description: string = this._truncateText(escape(idea.Description), 260);
          let ideaDate: string = this._getDate(idea.Created, "DD/MM/YYYY");

          ideaStream = ideaStream + `
            <div class=${styles.item}>
              <a href="">
                <img class=${styles.itemImage} src="${url}" />
              </a>
              <div class=${styles.info}>
                <div class=${styles.ideaTitle}>
                  <h3>
                    <a href="">${escape(idea.Title)}</a>
                  </h3>
                </div>
                <div class=${styles.desc}>${description}</div>
                <div class=${styles.dataRow}>
                  <div class="${styles.time}">
                    <i class='${styles.icon} ms-Icon ms-Icon--Clock' aria-hidden='true'></i>
                    <div class=${styles.rowText}> ${ideaDate}</div>
                  </div>
                  <div class="${styles.comments}">
                    <i class='${styles.icon} ms-Icon ms-Icon--Comment' aria-hidden='true'></i>
                    <div class=${styles.rowText}>${escape(idea.Comments)}</div>
                  </div>
                  <div class="${styles.tags}">
                    <i class='${styles.icon} ms-Icon ms-Icon--Tag' aria-hidden='true'></i>
                    <div class=${styles.rowText}>SPFx</div>
                </div>
                </div>
              </div>
            </div>
          `;
        });
      }

      element.innerHTML = `
        <div class=${styles.contentLeft}>
          ${ideaStream}
        </div>
      `;
      this._rendered = true;
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
