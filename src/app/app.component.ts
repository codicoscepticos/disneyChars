import { Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Store } from '@ngrx/store';
import {
  // [Disney API]
  fetchCharsPage,
  fetchSearchCharsPage,
} from './state/state.actions';
import { selectCharsPage, selectSearchCharsPage } from './state/state.selectors';

import { AppMode } from './interfaces/AppMode';
import { AppState } from './interfaces/AppState';
import { Char } from './interfaces/Char';
import { HandlerPerMsg } from './interfaces/HandlerPerMsg';
import { Message } from './interfaces/Message';
import { Page } from './interfaces/Page';
import { SearchPage } from './interfaces/SearchPage';
import { SortingMode } from './interfaces/SortingMode';
// TODO Put all the interfaces inside a single file.

import { DisneyAPIService } from './services/disney-api.service';
// import { MessengerService } from './services/messenger.service';

import { CharsComponent } from './chars/chars.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(CharsComponent) private charsComponent!: CharsComponent;
  @ViewChild(PieChartComponent) private pieChartComponent!: PieChartComponent;

  constructor(
    // private messengerService:MessengerService,
    private store: Store<AppState>
  ) {
    AppComponent.assignHandlersForMsgs();
  }

  static readonly nextSortingModePerCur: { [key in SortingMode]: SortingMode } = {
    original: 'ascending',
    ascending: 'descending',
    descending: 'original',
  };

  static readonly prefixPerSortingMode: { [key in SortingMode]: string } = {
    original: '',
    ascending: '↑',
    descending: '↓',
  };

  chars$ = new BehaviorSubject<Char[]>([]);
  charsPage$ = this.store.select(selectCharsPage); // RETHINK This and below maybe move inside observePage
  searchChars$ = new BehaviorSubject<Char[]>([]);
  searchCharsPage$ = this.store.select(selectSearchCharsPage);

  lastFetchedPageIndex: number = 0;
  lastRequestedPageIndex: number = 0;
  maxRequestedPageIndex: number = 0;
  maxResultsNum: number = Infinity;
  mode: AppMode = 'default';
  resultsNum: number = 0;
  selChar: Char | undefined = undefined;
  sortingMode: SortingMode = 'original';
  totalPages: number = Infinity;

  ngOnInit() {}
  ngAfterViewInit() {
    // this.setMessengerObserver();
    this.setPageObserver().setSearchPageObserver();

    this.maxRequestedPageIndex = 1;
    this.fetchCharsPageByIndex(1);
  }

  // TODO Move all to helper service.
  static sortAscendinglyByNumber(n1: number, n2: number) {
    return n1 - n2;
  }
  static sortAscendinglyByText(t1: string, t2: string) {
    return t1.localeCompare(t2);
  }
  static sortDescendinglyByNumber(n1: number, n2: number) {
    return n2 - n1;
  }
  static sortDescendinglyByText(t1: string, t2: string) {
    return t2.localeCompare(t1);
  }
  static readonly sortingPerMode = {
    ascending: {
      byNumber: AppComponent.sortAscendinglyByNumber,
      byText: AppComponent.sortAscendinglyByText,
    },
    descending: {
      byNumber: AppComponent.sortDescendinglyByNumber,
      byText: AppComponent.sortDescendinglyByText,
    },
  };

  //==== Observers ====

  // observeMsg(msg:Message){
  // }
  // setMessengerObserver(){
  //   const observeMsg = this.observeMsg.bind(this);
  //   const messenger$ = this.messengerService.getMessenger$();
  //   messenger$.subscribe(observeMsg);
  //   return this;
  // }

  private isNextPageObserved: boolean = false;
  observeNextPage(page: Page) {
    if (!this.isNextPageObserved) {
      this.isNextPageObserved = true;
      return;
    }

    let chars = <Char[]>page.data;

    let chars$ = this.chars$;
    let chars$Value = chars$.getValue();
    chars = <Char[]>[...chars$Value, ...chars]; // NOTE merging
    chars$.next(chars);

    this.resultsNum = chars.length;

    let lastFetchedPageIndex = (this.lastFetchedPageIndex += 1);

    let totalPages = (this.totalPages = page.totalPages);
    if (totalPages === lastFetchedPageIndex) {
      this.maxResultsNum = this.resultsNum;
      this.updateNextPageBtnState();
    } else {
      this.maxResultsNum = totalPages * DisneyAPIService.resultsNumPerPage; // TODO Move to ngOnInit
    }

    if (lastFetchedPageIndex >= this.maxRequestedPageIndex) return;

    this.charsComponent.updateResultsIndexes();
    this.sortResultsIndexes().updateChartData();
  }
  setPageObserver() {
    this.charsPage$.subscribe({
      next: this.observeNextPage.bind(this),
      error: console.log,
      complete: () => console.log('Complete'),
    });
    return this;
  }

  private isSearchPageObserved: boolean = false;
  observeSearchPage(page: SearchPage) {
    if (!this.isSearchPageObserved) {
      this.isSearchPageObserved = true;
      return;
    }

    let searchChars = <Char[]>page.data;
    this.searchChars$.next(searchChars);
    this.resultsNum = searchChars.length;

    this.charsComponent.updateResultsIndexes();
    this.sortResultsIndexes().updateChartData();
  }
  setSearchPageObserver() {
    this.searchCharsPage$.subscribe({
      next: this.observeSearchPage.bind(this),
      error: console.log,
      complete: () => console.log('Complete'),
    });
    return this;
  }

  //==== Methods ====

  calcMaxPageIndex() {
    return Math.ceil(this.maxResultsNum / this.charsComponent.resultsNumPerPage);
  }

  fetchCharsPageByIndex(pageIndex: number) {
    this.lastRequestedPageIndex = pageIndex;
    this.store.dispatch(fetchCharsPage({ pageIndex }));
    return this;
  }

  fetchCharsPages(num: number) {
    let totalPages = this.totalPages;
    let maxRequestedPageIndex = (this.maxRequestedPageIndex += num);
    if (maxRequestedPageIndex > totalPages) {
      num -= maxRequestedPageIndex - totalPages;
      this.maxRequestedPageIndex = totalPages;
    }

    let lastRequestedPageIndex = this.lastRequestedPageIndex;
    const startIndex = lastRequestedPageIndex + 1;
    const endIndex = lastRequestedPageIndex + num;
    for (let i = startIndex; i <= endIndex; i += 1) {
      this.fetchCharsPageByIndex(i);
    }
  }

  fetchSearchCharsPageByIndex(query: string) {
    this.store.dispatch(fetchSearchCharsPage({ query }));
    return this;
  }

  getCharsByIndexes(chars$: BehaviorSubject<Char[]>, indexes: number[]) {
    let chars: Char[] = chars$.getValue();
    return indexes.map((i) => chars[i]).filter((c) => c); // TODO generateIndexes to consider resultsNum (remove filter when ready)
  }

  sortResultsIndexes() {
    let charsComponent = this.charsComponent;

    let resultsIndexes = charsComponent.getResultsIndexes();
    resultsIndexes.sort(AppComponent.sortingPerMode.ascending.byNumber);

    let sortingMode = this.sortingMode;
    if (sortingMode === 'original') return this;

    const chars$ = this.mode === 'search' ? this.searchChars$ : this.chars$;
    const chars = this.getCharsByIndexes(chars$, resultsIndexes);
    let names = chars.map((char) => char.name); // TODO Become method.
    resultsIndexes = resultsIndexes.slice(0, names.length);

    const startIndex = resultsIndexes[0];
    resultsIndexes.sort(function (i1: number, i2: number) {
      // TODO Become method.
      if (startIndex > 0) {
        i1 = i1 % startIndex;
        i2 = i2 % startIndex;
      }
      let name1 = names[i1];
      let name2 = names[i2];
      if (sortingMode === 'descending') {
        const t = name1;
        name1 = name2;
        name2 = t;
      }
      return name1.localeCompare(name2);
    });
    charsComponent.updateResultsIndexes(resultsIndexes);

    return this;
  }

  updateChartData() {
    const resultsIndexes = this.charsComponent.getResultsIndexes();
    const chars$ = this.mode === 'search' ? this.searchChars$ : this.chars$; // RETHINK implementation
    const chars = this.getCharsByIndexes(chars$, resultsIndexes);
    this.pieChartComponent.updateChartData(chars);
    return this;
  }

  updateNextPageBtnState() {
    const maxPageIndex = Math.ceil(this.maxResultsNum / this.charsComponent.resultsNumPerPage);
    const nextPageBtnState = this.charsComponent.pageIndex < maxPageIndex ? 'enabled' : 'disabled';
    this.charsComponent.nextPageBtnState = nextPageBtnState;
  }

  updateSelChar(char: Char | undefined) {
    this.selChar = char;
    return this;
  }

  hasSufficientResults(pageIndex: number) {
    let startIndex = (pageIndex - 1) * this.charsComponent.getResultsNumPerPage();
    const endIndex = this.resultsNum - 1;
    if (startIndex <= endIndex) return true;

    let chars = this.chars$.getValue();
    const isChar = chars[startIndex];
    if (isChar !== undefined) return true;

    return false;
  }

  //==== Messaging ====

  handleMsg(msg: Message) {
    // Message Handler (for child)
    const handler = <Function>AppComponent.handlerPerMsg[msg.name];
    if (handler) handler.call(this, msg.content);
  }
  handleCharSelected(char: Char | undefined) {
    this.updateSelChar(char);
  }
  handleNameClicked() {
    let sortingMode = (this.sortingMode = AppComponent.nextSortingModePerCur[this.sortingMode]);
    const prefix = AppComponent.prefixPerSortingMode[sortingMode];
    this.charsComponent.updateNameTitlePrefix(prefix);
    this.sortResultsIndexes();
  }
  handlePageTurned(pageIndex: number) {
    if (this.hasSufficientResults(pageIndex)) {
      this.sortResultsIndexes().updateChartData().updateNextPageBtnState();
      return;
    }

    const pagesToFetchNum = Math.ceil(
      this.charsComponent.resultsNumPerPage / DisneyAPIService.resultsNumPerPage
    );
    this.fetchCharsPages(pagesToFetchNum);
  }
  handleResultsNumPerPageChanged({
    oldResultsNumPerPage,
    newResultsNumPerPage, // RETHINK Improve passing of multiple params.
  }: {
    oldResultsNumPerPage: number;
    newResultsNumPerPage: number;
  }) {
    let charsComponent = this.charsComponent;
    let pageIndex = charsComponent.getPageIndex();
    pageIndex = Math.floor((pageIndex - 1) * (oldResultsNumPerPage / newResultsNumPerPage) + 1);

    charsComponent
      .updateResultsNumPerPage(newResultsNumPerPage)
      .updatePageIndex(pageIndex)
      .updateResultsIndexes();

    let resultsNum = this.resultsNum;
    const newResultsNum = Math.ceil(resultsNum / newResultsNumPerPage) * newResultsNumPerPage;
    let pagesToFetchNum = (newResultsNum - resultsNum) / DisneyAPIService.resultsNumPerPage;
    if (pagesToFetchNum < 1) {
      this.sortResultsIndexes().updateChartData().updateNextPageBtnState();
      return;
    }

    this.fetchCharsPages(pagesToFetchNum);
  }
  handleSearchInputCleared() {
    this.mode = 'default';
    this.searchChars$.next([]);
    this.resultsNum = this.chars$.getValue().length;
    this.charsComponent.updatePageIndexToPrev().updateResultsIndexes();
    this.sortResultsIndexes().updateChartData();
  }
  handleSearchInputSubmitted(query: string) {
    this.mode = 'search';
    this.charsComponent.updatePrevPageIndex().updatePageIndex(1);
    this.fetchSearchCharsPageByIndex(query);
  }

  static readonly handlerPerMsg: HandlerPerMsg = {
    charSelected: 'handleCharSelected',
    nameClicked: 'handleNameClicked',
    pageTurned: 'handlePageTurned',
    resultsNumPerPageChanged: 'handleResultsNumPerPageChanged',
    searchInputCleared: 'handleSearchInputCleared',
    searchInputSubmitted: 'handleSearchInputSubmitted',
  };
  static assignHandlersForMsgs() {
    // TODO move to helper service
    let handlerPerMsg = AppComponent.handlerPerMsg;
    for (let msgName in handlerPerMsg) {
      const handlerName = <string>handlerPerMsg[msgName];
      handlerPerMsg[msgName] = (<any>AppComponent.prototype)[handlerName];
    }
  }
}
