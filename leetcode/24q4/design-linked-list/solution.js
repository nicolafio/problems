function MyLinkedList() {
    this._elements = new Set();
    this._head = null;
    this._tail = null;
}

/**
 * @param {number} index
 * @return {number}
 */
MyLinkedList.prototype.get = function(index) {
    if (index < 0) return -1;
    if (index >= this._elements.size) return -1;
    return this._get(index).val;
};

MyLinkedList.prototype._get = function(index) {
    let node = this._head;
    for (let i = 0; i < index; i++) {
        node = node.next;
    }
    return node;
}

/**
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtHead = function(val) {
    const node = { val, next: null, prev: null };
    if (this._elements.size === 0) {
        this._head = node;
        this._tail = node;
        this._elements.add(node);
        return;
    }
    node.next = this._head;
    this._head.prev = node;
    this._head = node;
    this._elements.add(node);
};

/**
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtTail = function(val) {
    const node = { val, next: null, prev: null };
    if (this._elements.size === 0) {
        this._head = node;
        this._tail = node;
        this._elements.add(node);
        return;
    }
    node.prev = this._tail;
    this._tail.next = node;
    this._tail = node;
    this._elements.add(node);
}

/**
 * @param {number} index
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtIndex = function(index, val) {
    if (index < 0) return;
    if (index > this._elements.size) return;
    if (index === 0) {
        this.addAtHead(val);
        return;
    }
    if (index === this._elements.size) {
        this.addAtTail(val);
        return;
    }
    const node = { val, next: null, prev: null };
    const next = this._get(index);
    node.prev = next.prev;
    node.prev.next = node;
    node.next = next;
    node.next.prev = node;
    this._elements.add(node);
};

/**
 * @param {number} index
 * @return {void}
 */
MyLinkedList.prototype.deleteAtIndex = function(index) {
    if (index < 0) return;
    if (index >= this._elements.size) return;
    if (this._elements.size === 1) {
        this._head = null;
        this._tail = null;
        this._elements.clear();
        return;
    }
    if (index === 0) {
        const node = this._head;
        node.next.prev = null;
        this._head = node.next;
        this._elements.delete(node);
        return;
    }
    if (index === this._elements.size - 1) {
        const node = this._tail;
        node.prev.next = null;
        this._tail = node.prev;
        this._elements.delete(node);
        return;
    }
    const node = this._get(index);
    if (node.next) node.next.prev = node.prev;
    if (node.prev) node.prev.next = node.next;
    this._elements.delete(node);
};

/**
 * Your MyLinkedList object will be instantiated and called as such:
 * var obj = new MyLinkedList()
 * var param_1 = obj.get(index)
 * obj.addAtHead(val)
 * obj.addAtTail(val)
 * obj.addAtIndex(index,val)
 * obj.deleteAtIndex(index)
 */

