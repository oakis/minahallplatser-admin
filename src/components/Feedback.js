import React, { PureComponent } from 'react';
import { Paper, Toolbar, Avatar, Icon, Typography, Button, Divider, TextField } from 'material-ui';
import ExpansionPanel, {
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    ExpansionPanelActions,
} from 'material-ui/ExpansionPanel';

const FeedbackItem = ({ children, label }) => (
    <div style={{ marginRight: '10px', whiteSpace: label === 'Message' ? 'wrap' : 'nowrap' }}>
        <h4>{label}</h4>
        <p>{children}</p>
    </div>
);

export default class Feedback extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            feedback: [],
        };
    }

    componentWillReceiveProps({ data }) {
        const feedback = data.map(item => (
            { ...item, item: { ...item.item, reply: '' } }
        ));
        this.setState({
            feedback,
        });
    }

    setReply = index => (event) => {
        const feedback = [...this.state.feedback];
        feedback[index].item.reply = event.target.value;
        this.setState({ feedback });
    }

    reply = (e, index) => {
        e.preventDefault();
        console.log(this.state.feedback[index].item.reply);
    }

    render() {
        const { data } = this.props;
        return (
            <div
                style={{
                    width: '100%', marginTop: '2.5em',
                }}
            >   <Paper>
                    <Toolbar>
                        User feedback
                    </Toolbar>
                </Paper>
                {data.map(({ key, item }, index) => {
                    const {
                        appVersion, device, email, message, name, os,
                    } = item;
                    const { reply } = this.state.feedback[index].item;
                    return (
                        <ExpansionPanel key={key}>
                            <ExpansionPanelSummary
                                expandIcon={<Icon>keyboard_arrow_down</Icon>}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar>{name.substr(0, 1)}</Avatar>
                                    <Typography style={{ marginLeft: '10px' }}>{message}</Typography>
                                </div>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                <FeedbackItem label="Name">
                                    {name}
                                </FeedbackItem>
                                <FeedbackItem label="E-mail">
                                    {email}
                                </FeedbackItem>
                                <FeedbackItem label="App Version">
                                    {appVersion}
                                </FeedbackItem>
                                <FeedbackItem label="Device">
                                    {device}
                                </FeedbackItem>
                                <FeedbackItem label="OS Version">
                                    {os}
                                </FeedbackItem>
                                <FeedbackItem label="Message">
                                    {message}
                                </FeedbackItem>
                            </ExpansionPanelDetails>
                            <Divider />
                            <ExpansionPanelActions>
                                <form onSubmit={e => this.reply(e, index)}>
                                    <TextField
                                        onChange={this.setReply(index)}
                                        value={reply}
                                        fullWidth
                                    />
                                    <Button
                                        size="small"
                                        type="submit"
                                    >
                                        <Icon>email</Icon> Reply
                                    </Button>
                                </form>
                            </ExpansionPanelActions>
                        </ExpansionPanel>
                    );
                })}
            </div>
        );
    }
}
