import React, { Component } from "react";
import "./mainViewContainer.css";
import { ChecklistCounter } from "./checklistCounter";
import { CreateNewChecklistButton } from "./createNewChecklist";
import ChecklistEditorContainer from "./checklistEditorContainer";
import MyChecklists from "../MainView/myChecklists";
import UserInputDialogContent from "../UserInputDialogContent";
import { Dialog } from "@material-ui/core";

export default class MainViewContainer extends Component {
	state = {
		checklistNumber: 2,
		disabled: "disabled",
		saveDisplay: "none",
		newChecklist: {},
		activeEditor: false,
		cleanEditor: false,
		updateNumber: 0,
		activeChecklist: 0,
		chosenList: "",
		showReader: false,
		loadedContent: 0,
		inputExist: false,
		changeNameInputExist: false,
		dialogId: "",
		dialogTitle: "",
		dialogLabel: "",
		dialogCallback: () => null
	};

	changeDisabled() {
		this.setState({
			disabled: null,
			saveDisplay: "block"
		});
	}

	createChecklistNameInput() {
		if (this.state.activeEditor) return;
		if (this.state.inputExist) return;
		if (this.state.changeNameinputExist) return;
		// this.setState({ inputExist: true });
		// const checklistNameContainer = document.createElement("div");
		// const checklistNameInput = document.createElement("input");
		// checklistNameInput.className = "addInput";
		// const checklistNameButton = document.createElement("button");
		// checklistNameButton.className = "addButton";
		// checklistNameButton.innerText = "Dodaj";
		// const checklistsList = document.querySelector(".mychecklists_list");
		// if (document.querySelector(".mychecklists_checklista")) {
		// 	checklistsList.insertBefore(
		// 		checklistNameContainer,
		// 		document.querySelector(".mychecklists_checklista")
		// 	);
		// } else {
		// 	checklistsList.appendChild(checklistNameContainer);
		// }
		// checklistNameContainer.appendChild(checklistNameInput);
		// checklistNameContainer.appendChild(checklistNameButton);
		// checklistNameButton.onclick = this.createNewChecklist.bind(this);
		this.setState({
			dialogOpen: true,
			dialogTitle: "Wpisz nazwę nowej listy",
			dialogId: "newListDialog",
			dialogLabel: "Nazwa",
			dialogCallback: this.createNewChecklist.bind(this)
		});
	}

	async createNewChecklist(name) {
		const addInput = document.querySelector(".addInput");
		const newChecklistNumber = this.state.checklistNumber + 1;

		const token = localStorage.getItem("x-auth-token");
		const requestHeaders = {
			"Content-Type": "application/json; charset=UTF-8",
			"x-auth-token": token
		};
		const requestBody = {
			name,
			content: null
		};

		try {
			let response = await fetch(`/checklist`, {
				method: "post",
				headers: requestHeaders,
				body: JSON.stringify(requestBody)
			});
			if (response.status !== 200) throw response;
			response = await response.json();
			this.setState({
				activeChecklist: response[response.length - 1],
				checklistNumber: newChecklistNumber,
				newChecklist: response[response.length - 1],
				activeEditor: true
			});
			this.updateChecklistNumber();
		} catch (error) {
			alert("Nie udało się połączyć z serwerem!");
			return;
		}

		this.changeDisabled();
		this.setState({ dialogOpen: false });
	}

    editExistList() {
        if (this.state.inputExist) return
        this.setState({ activeEditor: true });
        this.changeDisabled();
    }

	async putChecklistOnServer(name) {
		const token = localStorage.getItem("x-auth-token");
		const requestHeaders = {
			"Content-Type": "application/json",
			"x-auth-token": token
		};
		const requestBody = {
			name
		};

		try {
			const response = await fetch(`/checklist/${this.tempId}`, {
				method: "put",
				headers: requestHeaders,
				body: JSON.stringify(requestBody)
			});
            if (response.status !== 200) throw response;
            console.log(await response.json())
		} catch (error) {
			console.log(error);
			alert("Nie udało się połączyć z serwerem!");
        }
        this.tempId = undefined;
        this.setState({ dialogOpen: false });
	}

	editChecklistName(e) {
		if (this.state.activeEditor) return;
		if (this.state.inputExist) return;
		if (this.state.changeNameinputExist) return;
		// console.log(this.state.changeNameInputExist);
		// this.setState({ changeNameInputExist: true });
		// console.log(this.state.changeNameInputExist);
		const checklist = e.currentTarget.parentElement;
        const checklistTitle = checklist.firstElementChild;
        this.tempId = checklistTitle.id;
		// const checklistNameContainer = document.createElement("div");
		// const checklistNameInput = document.createElement("input");
		// checklistNameInput.className = "addInput";
		// const checklistNameButton = document.createElement("button");
		// checklistNameButton.className = "addButton";
		// checklistNameButton.innerText = "Zmień nazwę";
		// const checklistNameCancel = document.createElement("div");
		// checklistNameCancel.innerHTML = `<i class="fas fa-times"></i>`;
		// const checklistsList = document.querySelector(".mychecklists_list");
		// checklistsList.insertBefore(checklistNameContainer, checklist);
		// checklist.hidden = true;
		// checklistNameContainer.appendChild(checklistNameInput);
		// checklistNameContainer.appendChild(checklistNameButton);
		// checklistNameContainer.appendChild(checklistNameCancel);
		// checklistNameCancel.addEventListener("click",
		this.setState({
			dialogOpen: true,
			dialogTitle: "Wpisz nową nazwę listy",
			dialogId: "newListDialog",
			dialogLabel: "Nazwa",
			dialogCallback: this.putChecklistOnServer.bind(this)
		});
	}

	async saveChecklist() {
		const that = this;
		let listId = null;
		const newList = that.state.activeChecklist.listId;
		if (newList) listId = newList;
		else listId = that.state.activeChecklist.firstElementChild.id;
		this.setState({
			activeEditor: false,
			disabled: "disabled",
			saveDisplay: "none",
			cleanEditor: true
		});

		const token = localStorage.getItem("x-auth-token");
		const content = localStorage.getItem("draftail:content");
		const requestHeaders = {
			"Content-Type": "application/json",
			"x-auth-token": token
		};
		const requestBody = {
			content: content
		};

		try {
			const response = await fetch(`/checklist/${listId}`, {
				method: "put",
				headers: requestHeaders,
				body: JSON.stringify(requestBody)
			});
			if (response.status !== 200) throw response;
		} catch (error) {
			console.log(error);
			alert("Nie udało się połączyć z serwerem!");
			return;
		}
	}

	async chooseList(e) {
		if (this.state.activeEditor) return;
		if (this.state.inputExist) return;
		const that = e.currentTarget;
		const thatlistId = that.firstElementChild.id;
		this.setState({ activeChecklist: that });
		this.setState({ chosenList: that.id });

		const token = localStorage.getItem("x-auth-token");
		const requestHeaders = {
			"Content-Type": "application/json",
			"x-auth-token": token
		};
		try {
			let response = await fetch(`/checklist/${thatlistId}`, {
				method: "get",
				headers: requestHeaders
			});
			if (response.status !== 200) throw response;
			response = await response.json();
			const content = response.content;
			localStorage.setItem("draftail:content", content);
			this.setState({ loadedContent: this.state.loadedContent + 1 });
		} catch (error) {
			console.log(error);
			alert("Nie udało się połączyć z serwerem!");
			return;
		}
	}

	updateChecklistNumber() {
		this.setState({ updateNumber: this.state.updateNumber + 1 });
	}

	selectChecklist() {}

	changeEditorToReader() {
		this.setState({ showReader: true });
	}

	render() {
		const windowWidth = window.innerWidth;

		return (
			<section className="mainView__container">
				<div className="mainView__header">
					{windowWidth < 1025 ? (
						<div onClick={this.props.onClick}>
							<i className="fas fa-bars" />
						</div>
					) : null}
					<h2>Panel użytkownika</h2>
				</div>
				<div className="stateContainter">
					<ChecklistCounter
						number={this.state.checklistNumber}
						updateNumber={this.state.updateNumber}
					/>
					<CreateNewChecklistButton
						onClick={() => this.createChecklistNameInput()}
					/>
				</div>
				{windowWidth > 1025 ? (
					<ChecklistEditorContainer
						cleanEditor={this.state.cleanEditor}
						showLoadedContent={this.state.loadedContent}
						onClick={() => this.saveChecklist()}
						disabled={this.state.disabled}
						chosenList={this.state.chosenList}
						changeEditorToReader={this.state.showReader}
						saveDisplay={this.state.saveDisplay}
					/>
				) : null}
				<MyChecklists
					editChecklist={() => this.editExistList()}
					editChecklistName={(e, listId) => this.editChecklistName(e, listId)}
					updateChecklistNumber={() => this.updateChecklistNumber()}
					newChecklist={this.state.newChecklist}
					chooseList={e => this.chooseList(e)}
					changeEditorToReader={() => this.changeEditorToReader()}
					activeEditor={this.state.activeEditor}
					inputExist={this.state.inputExist}
				/>
				<Dialog open={this.state.dialogOpen}>
					<UserInputDialogContent
						title={this.state.dialogTitle}
						inputId={this.state.dialogId}
						type={"text"}
						placeholder={""}
						label={this.state.dialogLabel}
						callback={this.state.dialogCallback}
						onClose={() => this.setState({ dialogOpen: false })}
					/>
				</Dialog>
			</section>
		);
	}
}
