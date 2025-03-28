class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class SortedLinkedList {
  constructor() {
    this.head = null;
  }

  // Insert a new node in sorted order (by ID)
  insert(data) {
    const sortKey = data.title ? 'title' : 'username';
    const newNode = new Node(data);

    const getComparableValue = (value) => {
        return typeof value === 'string' ? value.toLowerCase() : value;
    };

    if (!this.head || getComparableValue(this.head.data[sortKey]) > getComparableValue(data[sortKey])) {
        newNode.next = this.head;
        this.head = newNode;
        return;
    }

    let current = this.head;
    while (current.next && getComparableValue(current.next.data[sortKey]) <= getComparableValue(data[sortKey])) {
        current = current.next;
    }

    newNode.next = current.next;
    current.next = newNode;
  }

  // Remove the first node
  removeFirst() {
    if (this.head) {
      this.head = this.head.next;
    }
  }

  // Remove the last node
  removeLast() {
    if (!this.head) return;

    if (!this.head.next) {
      this.head = null;
      return;
    }

    let current = this.head;
    while (current.next && current.next.next) {
      current = current.next;
    }

    current.next = null;
  }

  // Remove a node by a specific condition
  removeByCondition(condition) {
    if (!this.head) return;

    if (condition(this.head.data)) {
      this.head = this.head.next;
      return;
    }

    let current = this.head;
    while (current.next && !condition(current.next.data)) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
    }
  }

  // Convert the linked list to an array
  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }
}

module.exports = {SortedLinkedList, Node};