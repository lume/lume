import SinglyLinkedList from './SinglyLinkedList';

let trashList = new SinglyLinkedList();

let trash = function(data) {
  trashList.push(data);
}

export default trash;